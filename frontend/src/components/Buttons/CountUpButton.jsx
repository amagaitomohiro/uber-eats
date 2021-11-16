import React from 'react';

import { RoundButton } from '../shared_styled'

export const CountUpButton = ({
    onClick,
    isDisabled,
}) => (
  <RoundButton onClick={onClick} disabled={isDisabled}>
    + 
  </RoundButton>
)