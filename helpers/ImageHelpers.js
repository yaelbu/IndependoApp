import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {Platform} from 'react-native';
import {Alert} from 'react-native';
import { Camera } from 'expo-camera';

export const openImageLibrary = async()=>{
    const {status}=await Camera.requestPermissionsAsync();
    //const{status}=await Permissions.askAsync(Permissions.CAMERA)
    if(status!=='granted'){
        Alert.alert("","מצטערים, אנחנו צריכים הרשאת מצלמה כדי לבחור תמונה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }])
        return false;
    }
    else{
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[1,1],
            base64:true
        });
    return !result.cancelled ? result : false;
    }
};


export const openCamera = async()=>{
    const {status}=await Camera.requestPermissionsAsync()
    //const{status}=await Permissions.askAsync(Permissions.CAMERA,)
    if(status!=='granted'){
        Alert.alert("", "מצטערים, אנו זקוקים להרשאת מצלמה וגלגלת מצלמה כדי לבחור תמונה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }])
        return false;
    }
    else{
        const result=await ImagePicker.launchCameraAsync({
            quality:0.1,
            allowsEditing:Platform.OS=='ios'?false:true,
            aspect:[4,3],//only for android
            base64:true
        });
    return !result.cancelled ? result : false;
    }
}

    export const prepareBlob=async imageUrl=>{
        const blob=await new Promise((resolve,reject)=>{
            const xml=new XMLHttpRequest()
            //success resolved it
            xml.onload=function(e){
                resolve(xml.response)
            }
            //error threw new error
            xml.onerror=function(e){
                //console.log(e)
                reject(new TypeError('Image Upload Failed'))
            }
            //set the response type to get the blob
            xml.responseType='blob'
            xml.open('GET',imageUrl,true)
            xml.send()
        })
        return blob
    }


    export const openVideoLibrary = async()=>{
        const {status}=await Camera.requestPermissionsAsync()
        //const{status}=await Permissions.askAsync(Permissions.CAMERA)
        if(status!=='granted'){
            Alert.alert("", "מצטערים, אנחנו צריכים הרשאת מצלמה כדי לבחור תמונה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }])
            return false;
        }
        else{
            const result=await ImagePicker.launchCameraAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[1,1],
                base64:true
            });
        return !result.cancelled ? result : false;
        }
    };
    
