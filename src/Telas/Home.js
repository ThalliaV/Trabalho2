import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';

export default function Home({navigation}){
  const [likes, setLikes] = useState(0);
  
  return (
    <View style={styles.container}>
      <Image style={styles.imagem} source={require('../assets/morg.png')}>
      </Image>
      <Text style={styles.text1}>Bem vindo(a) a Biblioteca mariposa!</Text>
      <Text style={styles.text2}>Aqui você vai encontrar informações sobre:</Text>
      <StatusBar style="auto" />

      <View style={styles.buttonContainer}>
        <Button title="Missões" onPress={()=> navigation.navigate('Missoes')}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Temporada" onPress={()=> navigation.navigate('Temporada')}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Calendario" onPress={()=> navigation.navigate('Calendario')}/>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Artes da Comunidade" onPress={()=> navigation.navigate('ArtesComunidade')}/>
      </View>

      <Pressable style={({ pressed }) => [styles.likeButton, pressed && { opacity: 0.6 }]}
            onPress={() => setLikes(likes + 1)}>
                <Text style={styles.likeText}>Like: {likes}</Text>
      </Pressable>
    </View>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64369dff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
    },
  text1:{
    color: '#ffffffff',
    fontWeight: 'bold',
    fontSize: 25,
  },
  text2:{
    color: '#ffffffff',
    fontSize: 20,
  },
  buttonContainer: {
        marginVertical: 10,
        width: '60%'
    },
  likeButton: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    likeText: { color: '#000', fontSize: 18, fontWeight: 'bold'},
});
