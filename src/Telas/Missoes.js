//import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Rodape from '../Components/Rodape';

export default function Missoes({navigation}){
    return(
        <View style={styles.container}>
            <Image style={styles.imagem2} source={require('../assets/morgb.png')}></Image>
            <Text style={styles.title}>Missões Diárias</Text>
            <Text style={styles.text2}>1 - Abraçar um amigo</Text>
            <Text style={styles.text2}>2 - Conhecer alguém novo</Text>
            <Text style={styles.text2}>3 - Reviver as memórias de um espírito</Text>
            <Text style={styles.text2}>4 - Encontrar as velas no Final do arco-íris</Text>

            <Rodape navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#64369dff',
        paddingBottom: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },
    imagem2: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
    },
    text2:{
    color: '#fff',
    fontSize: 20,
},

});