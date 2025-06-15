import React from 'react';

function ProfileImageUpload({ previewImage, onImageSelect }) {
  return (
    <div className="mb-4 text-center">
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            onImageSelect(file);
          }
        }}
        hidden
      />
      <label htmlFor="imageInput" className="image-upload-label">
        <div className="profile-image-wrapper">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="profile-image" />
          ) : (
            <div className="plus-icon">+</div>
          )}
        </div>
      </label>
      <p className="text-muted small">Click the circle to upload a profile picture</p>
    </div>
  );
}

export default ProfileImageUpload;
