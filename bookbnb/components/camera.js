import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { Camera } from 'expo-camera';

//@refresh reset

function CameraInput(props) {
    const [photo, setPhoto] = React.useState('');
    const [camera, setCamera] = React.useState(null);
    const [takenPhoto, setTakenPhoto] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(false);

    React.useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
        })();
    }, []);

    async function takePhoto() {
        let photo = null;
        try {
            photo = await camera.takePictureAsync({
                quality: 0.5,
                base64: true,
                skipProcessing: true
            })
            console.log('foto tomada')
            setPhoto(photo);
            setTakenPhoto(true);
            setShowPreview(false);
            console.log(photo)
        } catch(e) {
            console.log(`Ocurrio un error! ${e}`)
        }
    }

    console.log(takenPhoto)

    if (!showPreview && photo) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={{uri: `data:image/gif;base64,${photo.base64}`}}
                    style={{flex: 1, width: '100%', height: undefined, aspectRatio: 1}}
                />
                <Button
                    style={{top: -60}}
                    dark={true}
                    onPress={() => setShowPreview(true)}
                    mode="contained">
                    Tomar foto
                </Button>
            </View>
        );
    }


    return(
        showPreview == false ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                        dark={true}
                        onPress={() => setShowPreview(true)}
                        mode="contained">
                        Preview
                    </Button>
                </View>
        ) : (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{height:300, width:300}}>
                    <Camera
                        radio="1:1"
                        ref={ref => { setCamera(ref) }}
                        onCameraReady={() => console.log('Camera ready!')}
                        type={Camera.Constants.Type.front}
                        style={{flex: 1}}
                    />
                    <Button
                        dark={true}
                        onPress={takePhoto}
                        mode="contained">
                        Tomar foto!
                    </Button>
                </View>
            </View>
        )
    );
}

export { CameraInput }
