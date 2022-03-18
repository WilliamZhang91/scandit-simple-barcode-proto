import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 35,
    },
    container2: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 35,
    },
    userContainer: {
        marginTop: 10
    },
    userImg: {
        width: 120,
        height: 120,
        borderRadius: 120,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    userNameText: {
        fontSize: 15,
        textAlign: 'center',
    },
    userRole: {
        textAlign: 'center',
        fontSize: 10,
    },
    header: {
        fontSize: 19,
        fontWeight: '400',
        textAlign: 'left',
        width: '80%',
        margin: "auto"
    },
    btnGrid: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        marginLeft: 'auto',
    },
    btn: {
        width: '40%',
        height: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        margin: '5%',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
        alignContent: "center"
    },
    btnIcons: {
        width: 35,
        height: 35,
        marginBottom: 10
    },
    btnText: {
        fontSize: 15,
        fontWeight: '600'
    },
    productImg: {
        borderRadius: 20,
        width: 200,
        height: 200,
    },
    productDescription: {
        marginTop: 15,
    },
    loading: {
        textAlign: "center",
        fontSize: 50,
        fontWeight: "900",
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
        bottom: -45,
        left: 27,
        zIndex: 1,
    },
    CancelBtn: {
        width: 100,
        height: 40,
        backgroundColor: '#e85151',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.5,
        position: 'absolute',
        bottom: -45,
        right: 27,
        zIndex: 1,
    },
});
