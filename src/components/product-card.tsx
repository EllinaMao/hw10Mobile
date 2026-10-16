import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onSoftDelete: () => void;
  onRestore: () => void;
  onHardDelete: () => void;
}

export const ProductCard = ({
  product,
  onEdit,
  onSoftDelete,
  onRestore,
  onHardDelete,
}: ProductCardProps) => {
  return (
    <View style={[styles.card, product.isDeleted && styles.cardDeleted]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          {product.isDeleted && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Удалён</Text>
            </View>
          )}
        </View>
        <Text style={styles.price}>{product.price.toFixed(2)} грн</Text>
      </View>

      <View style={styles.actions}>
        {product.isDeleted ? (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={onRestore} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Восстановить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={onHardDelete}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                Удалить навсегда
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={onEdit} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Редактировать</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onSoftDelete} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Удалить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={onHardDelete}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                Удалить навсегда
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardDeleted: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f0f0f",
    flexShrink: 1,
  },
  badge: {
    backgroundColor: "#e5e5e5",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#606060",
    textTransform: "uppercase",
  },
  price: {
    fontSize: 14,
    color: "#2e9e3f",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f0f0f",
  },
  dangerButton: {
    backgroundColor: "#fbdada",
  },
  dangerButtonText: {
    color: "#c22b2b",
  },
});
