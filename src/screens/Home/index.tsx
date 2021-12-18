import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [swipeableLoading, setSwipeableLoading] = useState(false);
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  const dataKey = '@savepass:logins';

  async function loadData() {
    try {
      const dataStorage = await AsyncStorage.getItem(dataKey);

      if (dataStorage) {
        const dataParse = JSON.parse(dataStorage);

        setData(dataParse);
        setSearchListData(dataParse);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar!');
    }
  }

  function handleFilterLoginData() {
    const filteredData = searchListData.filter(item => {
      const parsedLowerCase = item.service_name.toLowerCase();

      if (parsedLowerCase.includes(searchText.toLowerCase()))
        return item;
    });

    setSearchListData(filteredData);
  }

  function handleChangeInputText(text: string) {
    if (!text) {
      setSearchListData(data);
    }
    
    setSearchText(text);
  }

  async function handleDeleteLoginData(id: string) {
    const newListData = searchListData.filter((item) => {
      if (item.id !== id) {
        return item;
      }
    });

    await AsyncStorage.setItem(dataKey, JSON.stringify(newListData));

    setSearchListData(newListData);
    setSwipeableLoading(true);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Michel John',
          avatar_url: 'https://github.com/mchjohn.png'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              id={loginData.id}
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
              handleDeleteLoginData={handleDeleteLoginData}
            />
          }}
        />
      </Container>
    </>
  )
}