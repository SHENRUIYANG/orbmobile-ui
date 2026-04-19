import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TouchableOpacityProps,
} from 'react-native';
export type MIconButtonSize = 'small' | 'medium' | 'large';

export interface MIconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Icon element to render */
  children: React.ReactNode;
  /** Size preset */
  size?: MIconButtonSize;
  /** Custom style */
  style?: ViewStyle;
}

const sizeMap: Record<MIconButtonSize, number> = {
  small: 32,
  medium: 40,
  large: 48,
};

export const MIconButton: React.FC<MIconButtonProps> = ({
  children,
  size = 'medium',
  disabled,
  style,
  ...rest
}) => {
  const dim = sizeMap[size];

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled}
      style={[
        styles.base,
        { width: dim, height: dim, borderRadius: dim / 2 },
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
