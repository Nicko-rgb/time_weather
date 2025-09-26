// src/screens/pronostico/components/SearchBar.jsx
import React from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  ActivityIndicator,
  StyleSheet 
} from 'react-native';

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  isSearching, 
  placeholder = "Buscar ciudad...", 
  disabled = false 
}) => {
  const handleSubmit = () => {
    if (searchQuery.trim().length >= 2 && !isSearching) {
      onSearch();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, disabled && styles.disabled]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          editable={!disabled}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
        
        <TouchableOpacity 
          style={[
            styles.searchButton, 
            (disabled || isSearching || searchQuery.trim().length < 2) && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={disabled || isSearching || searchQuery.trim().length < 2}
        >
          {isSearching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchIcon}>🔍</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
        <Text style={styles.hint}>
          Ingresa al menos 2 caracteres para buscar
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: '#666',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchIcon: {
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    marginLeft: 16,
    fontStyle: 'italic',
  },
});

export default SearchBar;