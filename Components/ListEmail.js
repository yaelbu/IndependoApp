import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import Proptypes from "prop-types";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

const ListEmail = ({ children,data,renderItem,keyExtractor}) => (

    <View style={styles.container}>
    <FlatList data={data} renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        <View
        style={{ justifyContent: "center", alignItems: "center" }}
      >
          <Text style={styles.EmptyListText}>
           {children}
          </Text>
        </View>
      }
    />
  </View>
);

ListEmail.Proptypes = {
  children: Proptypes.element.isRequired,
  data: Proptypes.element.isRequired,
  renderItem: Proptypes.element.isRequired,
  keyExtractor:Proptypes.element.isRequired,
  style: Proptypes.object,
};

ListEmail.defaultProps = {
  style: [],
};

export default ListEmail;

const styles = StyleSheet.create({
  container: {
     height: HEIGHT/1.2,
  },


  EmptyListText: {
     fontSize: 50, 
     fontWeight: "100" },


});
