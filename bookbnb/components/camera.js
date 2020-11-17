import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { Camera } from 'expo-camera';

//@refresh reset

function CameraPreview(props) {
    const [camera, setCamera] = React.useState(null);

    React.useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
        })();
    }, []);

    async function takePhoto() {
        try {
            let photo = await camera.takePictureAsync({
                quality: 0.5,
                base64: true,
                skipProcessing: true
            })
            console.log('foto tomada')
            props.onPhoto(photo);
        } catch(e) {
            console.log(`Ocurrio un error! ${e}`)
        }
    }

    return (
        <>
            <Camera
                radio="1:1"
                ref={ref => { setCamera(ref) }}
                onCameraReady={() => console.log('Camera ready!')}
                type={Camera.Constants.Type.back}
                style={{flex: 1}}
            />
            <Button
                style={{bottom: 10, right: 10, position: 'absolute'}}
                dark={true}
                onPress={takePhoto}
                mode="contained">
                Tomar foto!
            </Button>
        </>
    );
}


function CameraInput(props) {
    const [photo, setPhoto] = React.useState('');
    const [showPreview, setShowPreview] = React.useState(false);

    let DEFAULT_IMG = "https://i.stack.imgur.com/y9DpT.jpg"

    console.log(`Showpreview = ${showPreview}`)
    console.log(photo)

    if (photo) {
        DEFAULT_IMG = `data:image/gif;base64,${photo.base64}`
    }

    return(showPreview == false ? (
        <View style={{width: 300, height: 300, borderWidth: 3}}>
            <Image
                source={{uri: DEFAULT_IMG}}
                style={{flex: 1, width: '100%', height: undefined, aspectRatio: 1}}
            />
            <Button
                style={{bottom: 10, right: 10, position: 'absolute'}}
                dark={true}
                onPress={() => setShowPreview(true)}
                icon='camera'
                mode="contained">
                Agregar foto
            </Button>
        </View>
    ) : (
        <View style={{width: 300, height: 300, borderWidth: 3}}>
            <CameraPreview onPhoto={value => {setPhoto(value); setShowPreview(false)}}/>
        </View>
    ));
}


export { CameraInput, CameraPreview }
