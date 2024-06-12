import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy'; // 올바르게 임포트되었는지 확인
import axios from 'axios';

const CameraComponent: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);
  const [cameraType, setCameraType] = useState(CameraType.back); // Camera.Constants.Type 사용

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Failed to request camera permission', error);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const uploadImage = async () => {
    if (photo) {
      const formData = new FormData();
      formData.append('photo', {
        uri: photo,
        name: 'photo.jpg',
        type: 'image/jpg'
      } as any);

      try {
        const response = await axios.post('YOUR_SERVER_URL_HERE', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Image uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
      <View style={styles.container}>
        {photo ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photo }} style={styles.previewImage} />
              <TouchableOpacity onPress={uploadImage} style={styles.button}>
                <Text style={styles.buttonText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
        ) : (
            <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity onPress={takePicture} style={styles.cameraButton}>
                  <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>
              </View>
            </Camera>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cameraButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
});

export default CameraComponent;
