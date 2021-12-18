import React, { useState } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MotiView } from 'moti'

import {
  Container,
  ShowPasswordButton,
  Icon,
  PassData,
  Title,
  Password,
  LoginData,
  BoldTitle,
  Email,
  Subtitle,
  SwipeableButton,
} from './styles';

interface Props {
  id: string;
  service_name: string;
  email: string;
  password: string;
  handleDeleteLoginData: (id: string) => void;
}

export function LoginDataItem({
  id,
  service_name,
  email,
  password,
  handleDeleteLoginData
}: Props) {
  const [passIsVisible, setPassIsVisible] = useState(false);

  function handleTogglePassIsVisible() {
    setPassIsVisible(!passIsVisible);
  }

  function LeftActions() {
    return (
      <SwipeableButton
        colors={['#fdd7d7',
          '#ffffff'
        ]}
      >
        <MotiView
          from={{
            transform: [
              { scale: 0.5 }, { translateY: -2 }
            ],
          }}
          animate={{
            transform: [
              { scale: 1 }, { translateY: 1 }
            ]
          }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 1500,
            delay: 50,
          }}
        >
          <Icon
            name={"trash-2"}
            color={'#ff2600'}
          />
        </MotiView>
        <Subtitle>Arraste até o fim para deletar</Subtitle>
      </SwipeableButton>
    );
  }

  return (
    <MotiView
      delay={200}
      from={{ translateY: -6, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
    >
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={() => handleDeleteLoginData(id)}
    >
      <Container
        colors={[
          passIsVisible
            ? '#EBF2FF'
            : '#ffffff',
          '#ffffff'
        ]}
      >
        <ShowPasswordButton
          onPress={handleTogglePassIsVisible}
        >
          <Icon
            name={passIsVisible ? "eye" : "eye-off"}
            color={passIsVisible ? '#1967FB' : '#888D97'}
          />
        </ShowPasswordButton>

        {passIsVisible
          ? (
            <PassData>
              <Title>{service_name}</Title>
              <Password>{password}</Password>
            </PassData>
          )
          : (
            <LoginData>
              <BoldTitle>{service_name}</BoldTitle>
              <Email>{email}</Email>
            </LoginData>
          )
        }
      </Container>
    </Swipeable>
    </MotiView>
  );
}