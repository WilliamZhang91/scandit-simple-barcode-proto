import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    headerContainer: {
        width: '100%',
        backgroundColor: 'white',
        height: 100,
        flexDirection: 'row'
    },
    flagIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#F6F6F6',
        borderRadius: 60,
        marginTop: 15,
        marginRight: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.5,
    },
    flagImg: {
        width: 20,
        height: 20,
    },
    completeText: {
        marginLeft: 25,
        fontSize: 16,
        fontWeight: '400',
    },
    productContainer: {
        width: '100%',
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 'auto',
    },
    doneBtn: {
        marginRight: 30,
        width: 100,
        height: 40,
        backgroundColor: '#0ABBBB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.5,
        position: 'absolute',
        bottom: 50,
        right: 10,
        zIndex: 1,
    },
    doneText: {
        fontSize: 18,
        fontWeight: '500',
    },
})