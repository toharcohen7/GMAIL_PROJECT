import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './SideBar.css';
import SystemLabel from '../SystemLabel/SystemLabel.js';
import AddLabel from '../AddLabel/AddLabel.js';
import UserLabel from '../UserLabel/UserLabel.js';
import AddLabelButton from './Buttons/AddLabelButton/AddLabelButton.js';
import { FetchWithAuth } from '../FetchWithAuth/FetchWithAuth';

const useLabels = () => {
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        async function fetchLabels() {
            try {
                const response = await FetchWithAuth('http://localhost:12345/api/labels');
                if (response.ok) {
                    const data = await response.json();
                    setLabels(data);
                } else {
                    console.error('Failed to fetch labels');
                }
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        }

        fetchLabels();
    }, []);

    return { labels, setLabels };
};

function SideBar({ onLabelSelect }) {
    const { labels, setLabels } = useLabels();
    const [showModal, setShowModal] = useState(false);
    const [editLabelData, setEditLabelData] = useState(null);
    const [selectedLabelName, setSelectedLabelName] = useState("Received");

    const handleCreateNewLabel = async (labelName) => {
        try {
            const response = await FetchWithAuth('http://localhost:12345/api/labels', {
                method: 'POST',
                body: JSON.stringify({
                    name: labelName,
                    iconClass: 'bi bi-tag'
                })
            });

            if (response.status === 201) {
                const newLabel = await response.json();
                setLabels([...labels, newLabel]);
                setShowModal(false);
            } else if (response.status === 409) {
                alert('Label name already exists. Please choose a different name.');
            } else {
                const errorData = await response.json();
                alert(`Failed to create label: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating label:', error);
            alert('Failed to create label. Please try again.');
        }
    };

    const handleCancelNewLabel = () => {
        setShowModal(false);
        setEditLabelData(null);
    };

    const handleLabelAction = async (action, labelName) => {
        try {
            if (action === "delete") {
                if (window.confirm(`Are you sure you want to delete label "${labelName}"?`)) {
                    await deleteLabel(labelName);
                }
            } else if (action === "edit") {
                const labelToEdit = labels.find(label => label.name === labelName);
                setEditLabelData(labelToEdit);
                setShowModal(true);
            }
        } catch (error) {
            console.error(`Error during ${action} action:`, error);
        }
    };

    const deleteLabel = async (labelName) => {
        try {
            const response = await FetchWithAuth(`http://localhost:12345/api/labels/${encodeURIComponent(labelName)}`, {
                method: "DELETE"
            });

            if (response.status === 204) {
                setLabels(labels.filter(label => label.name !== labelName));
            } else {
                const errorData = await response.json();
                alert(`Failed to delete label: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error deleting label:", error);
        }
    };

    const handleSaveLabel = async (newLabelName) => {
        if (editLabelData) {
            try {
                const response = await FetchWithAuth(`http://localhost:12345/api/labels/${encodeURIComponent(editLabelData.name)}`, {
                    method: "PATCH",
                    body: JSON.stringify({ name: newLabelName })
                });

                if (response.status === 204) {
                    setLabels(labels.map(label =>
                        label.name === editLabelData.name
                            ? { ...label, name: newLabelName }
                            : label
                    ));
                    setShowModal(false);
                    setEditLabelData(null);
                } else if (response.status === 409) {
                    alert("Label name already exists. Please choose a different name.");
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update label: ${errorData.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.error("Error updating label:", error);
            }
        } else {
            await handleCreateNewLabel(newLabelName);
        }
    };

    const handleAddLabelClick = () => {
        setEditLabelData(null);
        setShowModal(true);
    };

    const systemLabels = labels.slice(0, 4);
    const userLabels = labels.slice(4);

    return (
        <div className="sidebar">
            <ol className="list-group mb-0">
                {systemLabels.map((label, key) => (
                    <SystemLabel
                        key={`system-${key}`}
                        name={label.name}
                        iconClass={label.iconClass}
                        badgeCount={label.countBadge || 0}
                        onLabelClick={() => {
                            setSelectedLabelName(label.name);
                            onLabelSelect(label.name);
                        }}
                        isSelected={label.name === selectedLabelName}
                    />
                ))}
            </ol>
            <div className="label-divider d-flex justify-content-between align-items-center px-2">
                <span className="label-divider-text">Labels</span>
                <AddLabelButton onClick={handleAddLabelClick} />
            </div>
            <ol className="list-group mb-0">
                {userLabels.map((label, key) => (
                    <UserLabel
                        key={`user-label-${key}`}
                        name={label.name}
                        iconClass={label.iconClass}
                        badgeCount={label.countBadge || 0}
                        onActionClick={handleLabelAction}
                        onLabelClick={() => {
                            setSelectedLabelName(label.name);
                            onLabelSelect(label.name);
                        }}
                        isSelected={label.name === selectedLabelName}
                    />
                ))}
            </ol>
            {showModal && (
                <AddLabel
                    onSave={handleSaveLabel}
                    onCancel={handleCancelNewLabel}
                    initialValue={editLabelData ? editLabelData.name : ""}
                    title={editLabelData ? "Edit Label" : "Create New Label"}
                />
            )}
        </div>
    );
}

export default SideBar;
