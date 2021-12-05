import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { connect } from 'react-redux'
import Proptypes from "prop-types";

const { width: WIDTH } = Dimensions.get("window");



const StepsCountContainer = ({ type, ...props }) => (
    <View style={styles.container}>
        <Text style={{ fontSize: WIDTH / 27.6, marginBottom: 5 }}> {props.steps[type].length || 0} </Text>
    </View>
)

const mapStateToProps = state => {
    return {
        steps: state.steps
    }
}


StepsCountContainer.Proptypes = {
    type: Proptypes.string.isRequired
}

export default connect(mapStateToProps)(StepsCountContainer);

const styles = StyleSheet.create({
    container: {
        // flex:1,
        //alignItems:'center',
        //justifyContent:'center'

    }
})
