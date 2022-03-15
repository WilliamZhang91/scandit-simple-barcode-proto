import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        marginBottom: 5
    },
    panel: {
        flexDirection: "row",
        backgroundColor: "#E0EEFF",
        justifyContent: "space-between"
    },
    productImg: {
        height: 70,
        width: 70,
    },
    productDescription: {
        width: 150,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 5
    },
    input: {
        width: 60,
        height: 60,
        backgroundColor: "white",
        paddingLeft: 15,
        fontSize: 25,
        borderWidth: 1,
    },
    warehouseStock: {
        width: 60,
        height: 60,
        borderWidth: 1,
        fontSize: 20
    },
    text: {
        alignItems: "center"
    }
})