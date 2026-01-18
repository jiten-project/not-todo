import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input } from './ui';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

interface ViolationModalProps {
  visible: boolean;
  itemTitle: string;
  onClose: () => void;
  onSubmit: (memo?: string) => void;
}

export const ViolationModal: React.FC<ViolationModalProps> = ({
  visible,
  itemTitle,
  onClose,
  onSubmit,
}) => {
  const [memo, setMemo] = useState('');

  const handleSubmit = () => {
    onSubmit(memo.trim() || undefined);
    setMemo('');
  };

  const handleClose = () => {
    setMemo('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              <Text style={styles.title}>違反を記録</Text>
              <Text style={styles.itemTitle}>「{itemTitle}」をやってしまいましたか？</Text>

              <Input
                label="メモ（任意）"
                placeholder="状況や理由を記録..."
                value={memo}
                onChangeText={setMemo}
                multiline
                numberOfLines={3}
                style={styles.memoInput}
              />

              <View style={styles.buttons}>
                <Button
                  title="キャンセル"
                  variant="outline"
                  onPress={handleClose}
                  style={styles.button}
                />
                <Button
                  title="記録する"
                  variant="danger"
                  onPress={handleSubmit}
                  style={styles.button}
                />
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  keyboardView: {
    width: '100%',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  itemTitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  memoInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
