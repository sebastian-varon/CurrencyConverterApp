import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function MainScreen() {
  const [baseCurrency, setBaseCurrency] = useState('CAD');
  const [destCurrency, setDestCurrency] = useState('');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = async () => {
    try {
      setError(null);
      const response = await axios.get('https://api.freecurrencyapi.com/v1/latest', {
        params: {
          apikey: '[YOUR_API_KEY]', // Replace with your API key
          base_currency: baseCurrency,
        },
      });

      const rate = response.data.data[destCurrency.toUpperCase()];
      if (!rate) {
        setError('Invalid destination currency');
        return;
      }

      const result = (parseFloat(amount) * rate).toFixed(2);
      setConvertedAmount(`${amount} ${baseCurrency} = ${result} ${destCurrency.toUpperCase()}`);
    } catch (err) {
      setError('Failed to fetch exchange rate. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Base Currency Code (e.g., CAD):</Text>
      <TextInput
        style={styles.input}
        value={baseCurrency}
        onChangeText={setBaseCurrency}
      />

      <Text style={styles.label}>Destination Currency Code:</Text>
      <TextInput
        style={styles.input}
        value={destCurrency}
        onChangeText={setDestCurrency}
      />

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Button title="Convert" onPress={handleConvert} />

      {convertedAmount && <Text style={styles.result}>{convertedAmount}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
});
