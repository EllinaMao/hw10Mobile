import { useState } from "react";
import Checkbox from "expo-checkbox";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/product";

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const priceValue = Number(price.replace(",", "."));
  const canSubmit = name.trim().length > 0 && price.trim().length > 0 && priceValue > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setEditingId(null);
  };

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    if (editingId) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? { ...product, name: name.trim(), price: priceValue }
            : product,
        ),
      );
    } else {
      const newProduct: Product = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: name.trim(),
        price: priceValue,
        isDeleted: false,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    resetForm();
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
  };

  const softDelete = (id: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, isDeleted: true } : product)),
    );
    if (editingId === id) {
      resetForm();
    }
  };

  const restore = (id: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, isDeleted: false } : product)),
    );
  };

  const hardDelete = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const visibleProducts = showDeleted
    ? products
    : products.filter((product) => !product.isDeleted);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={visibleProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onEdit={() => startEdit(item)}
              onSoftDelete={() => softDelete(item.id)}
              onRestore={() => restore(item.id)}
              onHardDelete={() => hardDelete(item.id)}
            />
          )}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>Продукты</Text>

              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Название продукта"
                  placeholderTextColor="#a0a0a0"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Цена"
                  placeholderTextColor="#a0a0a0"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
                <View style={styles.formButtons}>
                  {editingId && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={resetForm}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelButtonText}>Отмена</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                    onPress={submit}
                    disabled={!canSubmit}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.submitButtonText}>
                      {editingId ? "Сохранить изменения" : "Добавить продукт"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.checkboxRow}>
                <Checkbox
                  value={showDeleted}
                  onValueChange={setShowDeleted}
                  color={showDeleted ? "#e02b2b" : undefined}
                />
                <Text style={styles.checkboxLabel}>Показывать удалённые продукты</Text>
              </View>

              <Text style={styles.sectionTitle}>
                {visibleProducts.length > 0 ? `Список продуктов (${visibleProducts.length})` : ""}
              </Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.emptyText}>Список продуктов пуст</Text>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f0f0f",
    marginBottom: 16,
  },
  form: {
    gap: 10,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f0f0f",
  },
  formButtons: {
    flexDirection: "row",
    gap: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#e02b2b",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#e5b3b3",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#606060",
    fontSize: 15,
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#0f0f0f",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#606060",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#a0a0a0",
    textAlign: "center",
    marginTop: 12,
  },
});

export default HomeScreen;
