import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarioSimples = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [eventos, setEventos] = useState([]);

  // Simulando API do FullCalendar
  const buscarEventos = async (data) => {
    try {
      // Aqui você faria a chamada para sua API real
      const eventosExemplo = [
        {
          id: 1,
          title: 'Evento Importante',
          start: '2024-01-15T10:00:00',
          end: '2024-01-15T11:00:00',
          description: 'Reunião de planejamento'
        },
        {
          id: 2,
          title: 'Almoço',
          start: '2024-01-15T12:00:00',
          end: '2024-01-15T13:00:00',
          description: 'Almoço com a equipe'
        }
      ];

      // Filtrar eventos pela data selecionada
      const eventosFiltrados = eventosExemplo.filter(evento => 
        evento.start.includes(data)
      );
      
      setEventos(eventosFiltrados);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      buscarEventos(selectedDate);
    }
  }, [selectedDate]);

  const renderEvento = ({ item }) => (
    <TouchableOpacity style={styles.cardEvento}>
      <Text style={styles.tituloEvento}>{item.title}</Text>
      <Text style={styles.horarioEvento}>
        {new Date(item.start).toLocaleTimeString()} - {new Date(item.end).toLocaleTimeString()}
      </Text>
      <Text style={styles.descricaoEvento}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Calendário</Text>
      
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#64369d' },
          '2024-01-15': { marked: true, dotColor: '#ff6b6b' },
          '2024-01-20': { marked: true, dotColor: '#ff6b6b' },
          '2024-01-25': { marked: true, dotColor: '#ff6b6b' }
        }}
        theme={{
          selectedDayBackgroundColor: '#64369d',
          todayTextColor: '#ff6b6b',
          arrowColor: '#64369d',
          monthTextColor: '#64369d',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300'
        }}
        style={styles.calendario}
      />

      <View style={styles.secaoEventos}>
        <Text style={styles.subtitulo}>
          Eventos para {selectedDate || 'selecione uma data'}
        </Text>
        
        <FlatList
          data={eventos}
          renderItem={renderEvento}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.textoSemEventos}>
              Nenhum evento para esta data
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64369d',
    textAlign: 'center',
    marginVertical: 20,
  },
  calendario: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  secaoEventos: {
    flex: 1,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64369d',
    marginBottom: 15,
  },
  cardEvento: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64369d',
    marginBottom: 5,
  },
  horarioEvento: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  descricaoEvento: {
    fontSize: 14,
    color: '#888',
  },
  textoSemEventos: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default CalendarioSimples;
