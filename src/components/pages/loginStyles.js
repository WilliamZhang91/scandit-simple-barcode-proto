import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0ABBBB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    crown: {
        width: 20,
        height: 20
    },
    loginHeader: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },
    scanId: {
        width: '85%',
        height: 175,
        backgroundColor: 'white',
        marginTop: 50,
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    camera: {
        width: 45,
        height: 45,
    },
    loginInputContainer: {
        width: '85%',
        flex: 0,
    },
    loginText: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20
    },
    loginInput: {
        width: '85%',
        height: 50,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 4
    },
    loginBtn: {
        width: 200,
        height: 50,
        backgroundColor: 'orange',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    loginBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
    }
})