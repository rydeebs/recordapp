const handleSaveVideo = async () => {
  if (!recordedBlob || !user) {
    alert("Please login to save recordings");
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  try {
    const timestamp = new Date().getTime();
    const videoFileName = `recordings/${user.uid}/${goalId}/${timestamp}.webm`;
    
    const storageRef = ref(storage, videoFileName);
    if (!storageRef) {
      throw new Error('Failed to create storage reference');
    }

    const metadata = {
      contentType: 'video/webm',
    };

    const uploadTask = uploadBytesResumable(storageRef, recordedBlob, metadata);
    if (!uploadTask) {
      throw new Error('Failed to start upload');
    }

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        setError(error.message);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (!downloadURL) {
            throw new Error('Failed to get download URL');
          }
          
          // ... rest of your success handling code ...
          
        } catch (err) {
          console.error('Error saving to Firestore:', err);
          setError('Failed to save recording details');
          setIsUploading(false);
        }
      }
    );
  } catch (err) {
    console.error('Save video error:', err);
    setError('Failed to save video');
    setIsUploading(false);
  }
};