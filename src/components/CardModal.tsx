import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';

type CardModalProps = {
  visible: boolean;
  onClose: () => void;
  add_type: string;
  account_type: string;
  category: string;
  amount: string;
  currency: string;
  repeat_frequency: string;
  date: string;
  situation: string;
  note: string;
  onSave: (
    add_type: string,
    account_type: string,
    category: string,
    amount: string,
    currency: string,
    repeat_frequency: string,
    date: string,
    situation: string,
    note: string,
  ) => void;
};

const CardModal: React.FC<CardModalProps> = ({
  visible,
  onClose,
  add_type,
  account_type,
  category,
  amount,
  currency,
  repeat_frequency,
  date,
  situation,
  note,
  onSave
}) => {
  const [editadd_type, setEditadd_type] = useState(add_type);
  const [editAccountType, setEditAccountType] = useState(account_type);
  const [editCategory, setEditCategory] = useState(category);
  const [editAmount, setEditAmount] = useState(amount);
  const [editCurrency, setEditCurrency] = useState(currency);
  const [editRepeatFrequency, setEditRepeatFrequency] = useState(repeat_frequency);
  const [editDate, setEditDate] = useState(date);
  const [editSituation, setEditSituation] = useState(situation);
  const [editNote, setEditNote] = useState(note);

  const handleSave = () => {
    onSave(
      editadd_type,
      editAccountType,
      editCategory,
      editAmount,
      editCurrency,
      editRepeatFrequency,
      editDate,
      editSituation,
      editNote,
    );
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.modalContainer}>
          <View style={styles.handle} />
          <TextInput
            style={styles.input}
            value={editadd_type}
            onChangeText={setEditadd_type}
            placeholder="Type"
          />
          <TextInput
            style={styles.input}
            value={editAccountType}
            onChangeText={setEditAccountType}
            placeholder="Account Type"
          />
          <TextInput
            style={styles.input}
            value={editCategory}
            onChangeText={setEditCategory}
            placeholder="Category"
          />
          <TextInput
            style={styles.input}
            value={editAmount}
            onChangeText={setEditAmount}
            placeholder="Amount"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={editCurrency}
            onChangeText={setEditCurrency}
            placeholder="Currency"
          />
          <TextInput
            style={styles.input}
            value={editRepeatFrequency}
            onChangeText={setEditRepeatFrequency}
            placeholder="Repeat Frequency"
          />
          <TextInput
            style={styles.input}
            value={editDate}
            onChangeText={setEditDate}
            placeholder="Date"
          />
          <TextInput
            style={styles.input}
            value={editSituation}
            onChangeText={setEditSituation}
            placeholder="Note"
          />
          <TextInput
            style={styles.input}
            value={editNote}
            onChangeText={setEditNote}
            placeholder="Note"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CardModal;
