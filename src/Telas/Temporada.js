//import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Rodape from '../Components/Rodape';

export default function Temporada({navigation}){
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Temporada Ativa</Text>
        <Image style={styles.imagem2} source={require('../assets/embers.png')}></Image>
            <Text style={styles.text2}>Duas Fagulhas</Text>

            <Rodape navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 60,
        backgroundColor: '#64369dff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    imagem2: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
    },
    text2:{
    color: '#fff',
    fontSize: 20,},
});