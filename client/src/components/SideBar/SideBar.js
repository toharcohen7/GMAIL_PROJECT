import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './SideBar.css';
import SystemLabel from '../SystemLabel/SystemLabel.js';
import AddLabel from '../AddLabel/AddLabel.js';
import UserLabel from '../UserLabel/UserLabel.js';

function useLabels() {
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        async function fetchLabels() {
            try {
                const response = await fetch("http://localhost:12345/api/labels", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "user-id": "1"
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setLabels(data);
                }
            } catch (error) {
                console.error("Failed to fetch labels:", error);
            }
        }
        fetchLabels();
    }, []);

    return { labels, setLabels };
}

function SideBar() {
    const { labels, setLabels } = useLabels();
    const [showModal, setShowModal] = useState(false);

    const handleCreateNewLabel = async (newLabelName) => {
        const labelDataToSend = {
            name: newLabelName,
            iconClass: "bi bi-bookmark-fill"
        };

        try {
            const response = await fetch("http://localhost:12345/api/labels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "user-id": "1"
                },
                body: JSON.stringify(labelDataToSend)
            });

            if (response.status === 400) {
                alert("Label already exists. Please choose a different name.");
            } else {
                const createdLabel = await response.json();
                setLabels([...labels, { ...createdLabel, countBadge: 0 }]);
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error creating new label:", error);
        }
    };

    const handleCancelNewLabel = () => {
        setShowModal(false);
    };

    const systemLabels = labels.slice(0, 3);
    const userLabels = labels.slice(3);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="bg-light sidebar">
                    <ol className="list-group mb-0">
                        {systemLabels.map((label, key) => (
                            <SystemLabel
                                key={`system-${key}`}
                                name={label.name}
                                iconClass={label.iconClass}
                                badgeCount={label.countBadge || 0}
                            />
                        ))}
                    </ol>
                    <div className="label-divider d-flex justify-content-between align-items-center px-2">
                        <span className="label-divider-text">Labels</span>
                        <button
                            className="btn btn-sm rounded-circle d-flex justify-content-center"
                            title="Create New Label"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="bi bi-plus fw-bold"></i>
                        </button>
                    </div>
                    <ol className="list-group mb-0">
                        {userLabels.map((label, key) => (
                            <UserLabel
                                key={`user-label-${key}`}
                                name={label.name}
                                iconClass={label.iconClass}
                                badgeCount={label.countBadge || 0}
                                onActionClick={(name) => console.log("Action clicked for", name)}
                            />
                        ))}
                    </ol>
                </div>
            </div>

            {showModal && (
                <AddLabel
                    onSave={handleCreateNewLabel}
                    onCancel={handleCancelNewLabel}
                />
            )}
        </div>
    );
}

export default SideBar;