import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput,
  Alert 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarioSimples = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [eventos, setEventos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEventoVisible, setModalEventoVisible] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [novoEvento, setNovoEvento] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    color: '#64369d'
  });

  // Cores para os eventos
  const coresEventos = ['#64369d', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

  // Buscar eventos do AsyncStorage
  const buscarEventos = async (data) => {
    try {
      const eventosSalvos = await AsyncStorage.getItem('eventos');
      const eventosArray = eventosSalvos ? JSON.parse(eventosSalvos) : [];
      
      // Filtrar eventos pela data selecionada
      const eventosFiltrados = eventosArray.filter(evento => 
        evento.start.includes(data)
      );
      
      setEventos(eventosFiltrados);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  // Salvar eventos no AsyncStorage
  const salvarEventos = async (novosEventos) => {
    try {
      await AsyncStorage.setItem('eventos', JSON.stringify(novosEventos));
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
    }
  };

  // Inicializar com dados de exemplo se não existirem
  useEffect(() => {
    const inicializarEventos = async () => {
      try {
        const eventosSalvos = await AsyncStorage.getItem('eventos');
        if (!eventosSalvos) {
          const eventosIniciais = [
            {
              id: 1,
              title: 'Evento Importante',
              start: '2024-01-15T10:00:00',
              end: '2024-01-15T11:00:00',
              description: 'Reunião de planejamento',
              color: '#64369d'
            },
            {
              id: 2,
              title: 'Almoço',
              start: '2024-01-15T12:00:00',
              end: '2024-01-15T13:00:00',
              description: 'Almoço com a equipe',
              color: '#ff6b6b'
            }
          ];
          await salvarEventos(eventosIniciais);
        }
      } catch (error) {
        console.error('Erro ao inicializar eventos:', error);
      }
    };

    inicializarEventos();
  }, []);

  // Buscar eventos quando a data selecionada mudar
  useEffect(() => {
    if (selectedDate) {
      buscarEventos(selectedDate);
    }
  }, [selectedDate]);

  // Preparar datas marcadas para o calendário
  const prepararDatasMarcadas = async () => {
    try {
      const eventosSalvos = await AsyncStorage.getItem('eventos');
      const eventosArray = eventosSalvos ? JSON.parse(eventosSalvos) : [];
      const marcadas = {};
      
      eventosArray.forEach(evento => {
        const data = evento.start.split('T')[0];
        marcadas[data] = { 
          marked: true, 
          dotColor: evento.color
        };
      });

      if (selectedDate) {
        marcadas[selectedDate] = {
          ...marcadas[selectedDate],
          selected: true,
          selectedColor: '#64369d'
        };
      }

      return marcadas;
    } catch (error) {
      console.error('Erro ao preparar datas:', error);
      return {};
    }
  };

  const [datasMarcadas, setDatasMarcadas] = useState({});

  // Atualizar datas marcadas
  useEffect(() => {
    const atualizarDatasMarcadas = async () => {
      const marcadas = await prepararDatasMarcadas();
      setDatasMarcadas(marcadas);
    };
    atualizarDatasMarcadas();
  }, [eventos, selectedDate]);

  // Criar novo evento
  const criarEvento = async () => {
    if (!novoEvento.title || !novoEvento.start) {
      Alert.alert('Erro', 'Título e hora de início são obrigatórios');
      return;
    }

    try {
      const eventosSalvos = await AsyncStorage.getItem('eventos');
      const eventosArray = eventosSalvos ? JSON.parse(eventosSalvos) : [];
      const novoId = eventosArray.length > 0 ? Math.max(...eventosArray.map(e => e.id)) + 1 : 1;
      
      const evento = {
        ...novoEvento,
        id: novoId,
        start: `${selectedDate}T${novoEvento.start}:00`,
        end: `${selectedDate}T${novoEvento.end || '23:59'}:00`
      };

      const novosEventos = [...eventosArray, evento];
      await salvarEventos(novosEventos);
      await buscarEventos(selectedDate);
      limparFormulario();
      setModalVisible(false);
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o evento');
    }
  };

  // Editar evento
  const editarEvento = async () => {
    try {
      const eventosSalvos = await AsyncStorage.getItem('eventos');
      const eventosArray = eventosSalvos ? JSON.parse(eventosSalvos) : [];
      const novosEventos = eventosArray.map(evento =>
        evento.id === eventoEditando.id ? eventoEditando : evento
      );
      
      await salvarEventos(novosEventos);
      await buscarEventos(selectedDate);
      setModalEventoVisible(false);
      Alert.alert('Sucesso', 'Evento atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o evento');
    }
  };

  // Excluir evento
  const excluirEvento = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const eventosSalvos = await AsyncStorage.getItem('eventos');
              const eventosArray = eventosSalvos ? JSON.parse(eventosSalvos) : [];
              const novosEventos = eventosArray.filter(evento => evento.id !== id);
              await salvarEventos(novosEventos);
              await buscarEventos(selectedDate);
              Alert.alert('Sucesso', 'Evento excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o evento');
            }
          }
        }
      ]
    );
  };

  // Limpar formulário
  const limparFormulario = () => {
    setNovoEvento({
      title: '',
      description: '',
      start: '10:00',
      end: '11:00',
      color: '#64369d'
    });
    setEventoEditando(null);
  };

  // Abrir modal para criar evento
  const abrirModalCriar = () => {
    setNovoEvento({
      title: '',
      description: '',
      start: '10:00',
      end: '11:00',
      color: coresEventos[Math.floor(Math.random() * coresEventos.length)]
    });
    setModalVisible(true);
  };

  // Abrir modal para editar evento
  const abrirModalEditar = (evento) => {
    setEventoEditando({...evento});
    setModalEventoVisible(true);
  };

  const renderEvento = ({ item }) => (
    <TouchableOpacity 
      style={[styles.cardEvento, { borderLeftColor: item.color }]}
      onPress={() => abrirModalEditar(item)}
    >
      <View style={styles.headerEvento}>
        <Text style={styles.tituloEvento}>{item.title}</Text>
        <TouchableOpacity onPress={() => excluirEvento(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
      <Text style={styles.horarioEvento}>
        {new Date(item.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
        {new Date(item.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Text>
      {item.description ? (
        <Text style={styles.descricaoEvento}>{item.description}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Calendário</Text>
      
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={datasMarcadas}
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

      {/* Botão Adicionar Evento */}
      {selectedDate && (
        <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirModalCriar}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.textoBotaoAdicionar}>Adicionar Evento</Text>
        </TouchableOpacity>
      )}

      <View style={styles.secaoEventos}>
        <Text style={styles.subtitulo}>
          Eventos para {selectedDate ? new Date(selectedDate).toLocaleDateString('pt-BR') : 'selecione uma data'}
        </Text>
        
        <FlatList
          data={eventos}
          renderItem={renderEvento}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.textoSemEventos}>
              {selectedDate ? 'Nenhum evento para esta data' : 'Selecione uma data para ver os eventos'}
            </Text>
          }
        />
      </View>

      {/* Modal Criar Evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Novo Evento</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título do evento *"
              value={novoEvento.title}
              onChangeText={(text) => setNovoEvento({...novoEvento, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={novoEvento.description}
              onChangeText={(text) => setNovoEvento({...novoEvento, description: text})}
              multiline
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Hora início (HH:MM) *"
                value={novoEvento.start}
                onChangeText={(text) => setNovoEvento({...novoEvento, start: text})}
              />
              
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Hora fim (HH:MM)"
                value={novoEvento.end}
                onChangeText={(text) => setNovoEvento({...novoEvento, end: text})}
              />
            </View>

            <Text style={styles.dataSelecionada}>
              Data: {selectedDate}
            </Text>

            <View style={styles.modalBotoes}>
              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoCancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoSalvar]}
                onPress={criarEvento}
              >
                <Text style={styles.textoBotaoSalvar}>Criar Evento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEventoVisible}
        onRequestClose={() => setModalEventoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Editar Evento</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título do evento *"
              value={eventoEditando?.title || ''}
              onChangeText={(text) => setEventoEditando({...eventoEditando, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={eventoEditando?.description || ''}
              onChangeText={(text) => setEventoEditando({...eventoEditando, description: text})}
              multiline
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoExcluir]}
                onPress={() => {
                  setModalEventoVisible(false);
                  excluirEvento(eventoEditando?.id);
                }}
              >
                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoCancelar]}
                onPress={() => setModalEventoVisible(false)}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.botaoModal, styles.botaoSalvar]}
                onPress={editarEvento}
              >
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  botaoAdicionar: {
    backgroundColor: '#64369d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  textoBotaoAdicionar: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
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
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerEvento: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64369d',
    flex: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64369d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dataSelecionada: {
    textAlign: 'center',
    color: '#64369d',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoModal: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: '#64369d',
  },
  botaoCancelar: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botaoExcluir: {
    backgroundColor: '#ff6b6b',
  },
  textoBotaoSalvar: {
    color: 'white',
    fontWeight: 'bold',
  },
  textoBotaoCancelar: {
    color: '#666',
    fontWeight: 'bold',
  },
  textoBotaoExcluir: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarioSimples;
