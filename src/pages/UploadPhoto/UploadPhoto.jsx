import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPhoto } from '../../redux/uploadPhoto/photoSlice';
import { toast } from 'react-toastify';
import styles from './uploadPhotoCss.module.css';
import CameraIcon from '../../SVG/camera.svg?url';
import { useNavigate } from 'react-router-dom';

const MAX_SIZE_MB = 5;

const UploadPhoto = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();
  const { loading, photoUrl } = useSelector((state) => state.photo);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Будь ласка, виберіть файл для завантаження!');
      return;
    }
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Будь ласка, виберіть зображення.');
      return;
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Файл завеликий (максимум ${MAX_SIZE_MB} МБ).`);
      return;
    }
    dispatch(uploadPhoto(selectedFile))
      .unwrap()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  return (
    <div className={styles.boxContainer}>
      <h2 className={styles.title}>Upload your photo</h2>

      <input
        type="file"
        accept="image/*"
        id="file-input"
        className={styles.inputFile}
        onChange={handleFileChange}
      />

      <label htmlFor="file-input" className={styles.avatarPhotoContainer}>
        {previewUrl ? (
          <img src={previewUrl} alt="Превʼю фото" />
        ) : photoUrl ? (
          <img src={photoUrl} alt="Завантажене фото" />
        ) : (
          <img
            src={CameraIcon}
            className={styles.cameraIcon}
            alt="Іконка камери"
          />
        )}
      </label>

      <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        className={styles.buttonSave}
      >
        {loading ? 'loading...' : 'Save'}
      </button>
    </div>
  );
};

export default UploadPhoto;