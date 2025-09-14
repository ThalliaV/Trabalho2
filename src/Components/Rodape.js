import { StyleSheet, Text, View, Pressable, } from 'react-native';
import { useNavigation } from '@react-navigation/native'


export default function Rodape({}) {
    const navigation = useNavigation()
    
    return(
        <View style={styles.footer}>
            <Pressable style={({ pressed }) => [styles.button,pressed && { opacity: 0.6 }]}
            onPress={() => navigation.navigate('Home')}
            >
            <Text style={styles.buttonText}>Home</Text>
            </Pressable>
        </View>
    );

}

const styles = StyleSheet.create({
    footer:{
        width:'100%',
        height: 60,
        borderTopWidth:1,
        borderColor: '#ffffffff',
        backgroundColor: '#64369dff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
    },
});