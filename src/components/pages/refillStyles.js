import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white"
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        marginTop: 25,
    },
    btnMenu: {
        width: "25%",
        height: 40,
        backgroundColor: '#E0EEFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 3,
        shadowOpacity: 0.5,
        marginTop: 10
    },
    menuText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500'
    },
    flag: {
        width: "15%",
        height: 55,
        backgroundColor: "#E0EEFF",
        marginLeft: 20,
        borderRadius: 60,
        textAlign: "center",
    },
    taskNumb: {
        fontSize: 20,
        justifyContent: "center",
        backgroudColor: "blue"
    },
    btnBackground: {
        backgroundColor: "#FF9191"
    },
    doneBtn: {
        width: 100,
        height: 40,
        backgroundColor: '#00f6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.5,
        position: 'absolute',
        bottom: 70,
        right: 27,
        zIndex: 1,
    },
})