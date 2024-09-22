import BaseModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';

export function Modal(props) {
    return (
        <BaseModal {...props} size="lg" centered>
            <BaseModal.Header closeButton>
                <BaseModal.Title id="contained-modal-title-vcenter">
                    Followers
                </BaseModal.Title>
            </BaseModal.Header>
            <BaseModal.Body style={{fontSize: "16px"}}>
                {
                    props.friends.length > 0 ? (
                        props.friends.map((friend, index) => (
                            <p key={index}>
                                {friend.username}
                            </p>
                        ))
                    ) : (
                        <p>No friends found</p>
                    )
                }
            </BaseModal.Body>
            <BaseModal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </BaseModal.Footer>
        </BaseModal>
    );
}