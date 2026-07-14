import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#22c55e",
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 5,
  },
  company: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a2035",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#666",
    width: "40%",
  },
  value: {
    fontSize: 10,
    color: "#1a2035",
    fontWeight: "bold",
    width: "60%",
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#22c55e",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
  },
  total: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#22c55e",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a2035",
    marginRight: 20,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22c55e",
    width: 100,
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },
});

interface ReceiptPDFProps {
  receiptNumber: string;
  date: Date;
  amount: string;
  currency: string;
  stationName: string;
  durationMinutes: number;
  reservationDate: Date;
  customerName: string;
  customerEmail: string;
  transactionId: string;
}

export const ReceiptPDF = ({
  receiptNumber,
  date,
  amount,
  currency,
  stationName,
  durationMinutes,
  reservationDate,
  customerName,
  customerEmail,
  transactionId,
}: ReceiptPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>⚡ EB Volt</Text>
        <Text style={styles.company}>EB Volt - Ghana's Premier EV Charging Network</Text>
      </View>

      {/* Receipt Title */}
      <View style={styles.section}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1a2035", marginBottom: 5 }}>
          PAYMENT RECEIPT
        </Text>
        <Text style={{ fontSize: 10, color: "#666" }}>Receipt #{receiptNumber}</Text>
      </View>

      {/* Receipt Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Receipt Date:</Text>
          <Text style={styles.value}>{date.toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{transactionId}</Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CUSTOMER INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{customerEmail}</Text>
        </View>
      </View>

      {/* Charging Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CHARGING DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Station:</Text>
          <Text style={styles.value}>{stationName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reservation Date:</Text>
          <Text style={styles.value}>{reservationDate.toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{durationMinutes} minutes</Text>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>
          {currency} {amount}
        </Text>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Method:</Text>
          <Text style={styles.value}>MTN Mobile Money (MoMo)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>Completed</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for using EB Volt!</Text>
        <Text>For support, contact: support@ecobellevolt.com</Text>
        <Text>This receipt is valid proof of payment</Text>
      </View>
    </Page>
  </Document>
);
