import styled from 'styled-components';

import { BaseButton } from '../shared_styled';

import { FONT_SIZE } from '../../style_constants';

export const OrderButton = styled(BaseButton)`
  width: 390px;
  background-color: black;
  color: white;
  border-style: none;
  padding: 8px 16px;
  font-size: ${FONT_SIZE.BODY1};
`;