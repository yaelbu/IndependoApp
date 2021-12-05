import { StyleSheet, Dimensions } from 'react-native';
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default StyleSheet.create({


    container: {
        width: WIDTH - WIDTH / 14,
         alignItems: "flex-end", 
        alignSelf: 'center',
        backgroundColor: "#efe8fd",
        borderRadius: 8,
        borderColor: "black",
        borderWidth: 0.7,
        flex: 3.5,
        marginBottom: HEIGHT / 60,
    },


    containerFeedback: {
        width: WIDTH - WIDTH / 14,
        //alignItems: "flex-end",
        alignSelf: 'center',
        backgroundColor: "#efe8fd",//"#efe8fd"
        borderRadius: 8,
        borderColor: "black",
        borderWidth: 0.7,
        marginBottom: HEIGHT / 45,
        flex: 8

    },

    listItemContainer: {
        borderRadius: 10,
        paddingHorizontal:5,
        paddingVertical:WIDTH/41,
        justifyContent:'center',
        alignItems: 'center',
        flex: 1,
    //    backgroundColor:'green'

    },

    listItemContainerFeedback: {
        height: WIDTH / 2.5,
        width: WIDTH / 3.5,
        flexDirection: "column",
        paddingTop: HEIGHT / 67,
        alignItems: "center",
        borderWidth: 0.5,
        marginHorizontal: WIDTH / 120,
        justifyContent: "center",
        marginVertical: WIDTH / 120,
        borderRadius: 3,
        backgroundColor: 'white'
    },
    TitleStyle: {
        color: "black",
        marginRight: WIDTH/27,
        fontSize: WIDTH / 16,
        textDecorationLine: "underline",
    },

    image: {
        //flex: 1,
        height: HEIGHT / 9.5,
        width: HEIGHT / 9.5,
        borderRadius: HEIGHT / 19,
        borderColor: "black",
        borderWidth: 0.5,
        justifyContent: 'center',
        alignSelf: 'center',

    },
  
    
ImageWhite:{
    height: HEIGHT / 9.5,
    width: HEIGHT / 9.5,
    borderRadius: HEIGHT / 19,
    borderColor: "black",
    borderWidth: 1,
  
},

    ImageStyleFeedback:{
        height: HEIGHT /15,
        width: HEIGHT / 15,
        borderRadius: HEIGHT / 30,
        borderWidth: 1,
    },

    imageContainer: {
        height: HEIGHT / 9.5,
        width: HEIGHT / 9.5,
        borderRadius: HEIGHT / 19,
        //flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor:'pink'
        //borderWidth:4,
        //margin:10,
      
        
    },

    imageFeedback: {
        //flex: 1,
        height: HEIGHT / 15,
        width: HEIGHT / 15,
        borderRadius: HEIGHT / 30,
        borderColor: "black",
        justifyContent: 'center',
        alignSelf: 'center',
        

    },



    imageContainerFeedback: {
        height: HEIGHT / 20,
        width: WIDTH / 20,
        borderRadius: HEIGHT/40,
        marginVertical:WIDTH/55,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },

    emptyListText: {
        fontSize: WIDTH / 21,
        fontWeight: "bold",
        //backgroundColor:'red',
        flex:1,
        //justifyContent:'center',
        //alignSelf:'stretch',
        alignItems:'center'
    },

    ImageStyleTask: {
        height: HEIGHT / 9.5,
        width: HEIGHT / 9.5,
        borderRadius: HEIGHT / 19,
        borderWidth: 1,
    },

    textChildName: {
        fontSize: WIDTH / 23,
        fontWeight: "700",
        textDecorationLine: "underline",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf:'center',
        textAlign:'center'
    },

    textTasknameFeedback: {
        fontSize: WIDTH / 27.5,
        fontWeight: "600",
        marginBottom: HEIGHT / 300,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center'
        //alignContent: 'center',
        //alignSelf:'auto'
        
    },

    textTaskname: {
        paddingTop: HEIGHT/180,
        fontSize: WIDTH / 26,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf:'center'
    },

    LikeStyleDesign: {
        width: WIDTH / 13,
        marginLeft: 2,
    },
    LikeStyleText: {
        fontSize: WIDTH / 13.8
    },

    LikeView: {
        flexDirection: "row",
        marginBottom: HEIGHT / 60
    }
});