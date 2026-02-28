import { AccountCircle } from "@mui/icons-material";
import { Badge, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import BaseModal from "../../../shared/ui/Modal";

// Шаблонні дані акаунтів (згідно з ТЗ, вони тягнуться з бази [cite: 42, 43])
const MOCK_ACCOUNTS = [
  { id: "u1", login: "manager_usa_1", isShared: true, hasActiveSession: true },
  { id: "u2", login: "main_buyer_pro", isShared: false, hasActiveSession: false },
];

interface Props {
  open: boolean;
  onClose: () => void;
  auctionTitle: string;
  auctionId: string;
}

export default function AccountSelectModal({ open, onClose, auctionTitle }: Props) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Вибір акаунта: ${auctionTitle}`}
      maxWidth="xs"
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Оберіть обліковий запис для запуску віддаленої сесії[cite: 99, 100].
      </Typography>

      <List sx={{ pt: 0 }}>
        {MOCK_ACCOUNTS.map((account) => (
          <ListItemButton
            key={account.id}
            onClick={() => {
              // Логіка: якщо sessionActive — joinSession, інакше — startNewSession [cite: 105, 362, 363]
              console.log("Запуск сесії для", account.login);
              onClose();
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              border: "1px solid #eee",
              "&:hover": { borderColor: "var(--color-primary)" }
            }}
          >
            <ListItemIcon>
              <Badge
                variant="dot"
                color={account.hasActiveSession ? "success" : "default"}
                invisible={!account.hasActiveSession}
              >
                <AccountCircle color="primary" />
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary={account.login}
              secondary={account.hasActiveSession ? "Є активна сесія (приєднатися)" : "Нова сесія"}
            />
          </ListItemButton>
        ))}
      </List>
    </BaseModal>
  );
}