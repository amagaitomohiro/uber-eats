import React from 'react';

import { RoundButton } from '../shared_styled'

export const CountDownButton = ({
  onClick,
  isDisabled,
}) => (
  <RoundButton onClick={onClick} disabled={isDisabled}> 
    -
  </RoundButton>
)