import axios from 'axios';
import { toast } from 'react-toastify';

const driveServerUrl = process.env.REACT_APP_DRIVE_SERVER_URL;

export const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Uploading Files to Storage
const storeImagesInDrive = async (files, listingFolderId) => {
  try {
    const response = await axios.post(
      `${driveServerUrl}/upload`,
      {
        listingFolderId,
        files,
      },
      {
        headers: { 'content-type': 'multipart/form-data' },
      }
    );

    return new Promise((resolve) => {
      resolve(response.data.data);
    });
  } catch (error) {
    toast.error('Could Not Upload Files');
  }
};

// Build array of image Ids to put in firebase listing document
export const getImagesIdsArray = async (userId, listingId, images) => {
  const listingFolderId = await createUserAndListingFolder(userId, listingId);

  return await storeImagesInDrive(images, listingFolderId);
};

const createUserAndListingFolder = async (userId, listingId) => {
  const response = await axios.post(`${driveServerUrl}/upload-folder`, {
    userId,
    listingId,
  });

  return response.data.data;
};

// -------------------
export const cleanUpTempFiles = async (paths, type = null) => {
  try {
    await axios.delete(`${driveServerUrl}/clean-up`, {
      data: {
        paths,
        type,
      },
    });
    return new Promise((resolve) => resolve('success'));
  } catch (error) {
    toast.error('Could not remove Temp files images');
  }
};

export const removeSingleFileFromDrive = async (fileId) => {
  try {
    await axios.delete(`${driveServerUrl}/drive/${fileId}`);
    return new Promise((resolve) => resolve());
  } catch (error) {
    toast.error('Could not remove file');
  }
};
export const removeImageFilesFromDrive = async (fileIds) => {
  try {
    await axios.delete(`${driveServerUrl}/drive`, { data: { fileIds } });
    return new Promise((resolve) => resolve());
  } catch (error) {
    toast.error('Could not remove images');
  }
};

export const removeFolderFromDrive = async (folderId) => {
  try {
    await axios.delete(`${driveServerUrl}/drive/folder/${folderId}`);
    return new Promise((resolve) => resolve());
  } catch (error) {
    toast.error('Could not remove file');
  }
};
