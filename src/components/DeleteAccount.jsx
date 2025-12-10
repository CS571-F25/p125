import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { auth, db } from "../firebase";
import { deleteUser } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function DeleteAccount({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [password, setPassword] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setConfirmText("");
    setPassword("");
    setError("");
    setNeedsReauth(false);
  };

  const handleShow = () => setShowModal(true);

  const handleReauthenticate = async () => {
    try {
      const user = auth.currentUser;
      
      // Check if user signed in with Google
      const isGoogleUser = user.providerData.some(
        provider => provider.providerId === 'google.com'
      );

      if (isGoogleUser) {
        // Re-authenticate with Google popup
        const { reauthenticateWithPopup } = await import("firebase/auth");
        const { googleProvider } = await import("../firebase");
        await reauthenticateWithPopup(user, googleProvider);
      } else {
        // Re-authenticate with email/password
        if (!password) {
          setError("Please enter your password");
          return;
        }
        const { reauthenticateWithCredential, EmailAuthProvider } = await import("firebase/auth");
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      // After successful re-authentication, proceed with deletion
      setNeedsReauth(false);
      setPassword("");
      await proceedWithDeletion();
    } catch (error) {
      console.error("Re-authentication failed:", error);
      setError(`Re-authentication failed: ${error.message}`);
      setDeleting(false);
    }
  };

  const proceedWithDeletion = async () => {
    try {
      // Delete all user's cards from collection
      const userCardsRef = collection(db, "userCards");
      const userCardsQuery = query(userCardsRef, where("userId", "==", user.uid));
      const userCardsSnapshot = await getDocs(userCardsQuery);
      
      const deleteUserCardsPromises = userCardsSnapshot.docs.map((document) =>
        deleteDoc(doc(db, "userCards", document.id))
      );
      await Promise.all(deleteUserCardsPromises);

      // Delete all user's wishlist items
      const wishListRef = collection(db, "wishList");
      const wishListQuery = query(wishListRef, where("userId", "==", user.uid));
      const wishListSnapshot = await getDocs(wishListQuery);
      
      const deleteWishListPromises = wishListSnapshot.docs.map((document) =>
        deleteDoc(doc(db, "wishList", document.id))
      );
      await Promise.all(deleteWishListPromises);

      // Delete the user account from Firebase Auth
      await deleteUser(auth.currentUser);

      // User will be automatically logged out after account deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      // Check if error requires recent login
      if (error.code === 'auth/requires-recent-login') {
        throw error; // Re-throw to be caught by handleDeleteAccount
      }
      setError(`Failed to delete account: ${error.message}`);
      setDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await proceedWithDeletion();
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setNeedsReauth(true);
        setDeleting(false);
        setError("For security reasons, please re-authenticate to delete your account.");
      } else {
        console.error("Error deleting account:", error);
        setError(`Failed to delete account: ${error.message}`);
        setDeleting(false);
      }
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow} className="w-100">
        Delete Account
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <Alert.Heading>Warning!</Alert.Heading>
            <p>
              This action is <strong>permanent and cannot be undone</strong>. Deleting your account will:
            </p>
            <ul>
              <li>Remove all your collected cards</li>
              <li>Remove all your wishlist items</li>
              <li>Delete your account permanently</li>
            </ul>
          </Alert>

          {error && <Alert variant="danger">{error}</Alert>}

          {needsReauth ? (
            <>
              <Alert variant="info">
                Please re-authenticate to continue with account deletion.
              </Alert>
              {!auth.currentUser?.providerData.some(p => p.providerId === 'google.com') && (
                <Form.Group className="mb-3">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={deleting}
                  />
                </Form.Group>
              )}
            </>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>
                Type <strong>DELETE</strong> to confirm:
              </Form.Label>
              <Form.Control
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                disabled={deleting}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={deleting}>
            Cancel
          </Button>
          {needsReauth ? (
            <Button 
              variant="danger" 
              onClick={handleReauthenticate}
              disabled={deleting}
            >
              {deleting ? "Re-authenticating..." : "Re-authenticate & Delete"}
            </Button>
          ) : (
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={deleting || confirmText !== "DELETE"}
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
