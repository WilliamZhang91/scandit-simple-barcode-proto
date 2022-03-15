import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 25,
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
        marginBottom: 40,
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
        width: 250,
        height: 250,
    },
    productDescription: {
        marginTop: 15,
    }
});
