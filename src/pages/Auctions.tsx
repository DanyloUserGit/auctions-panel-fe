import { Add } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AuctionsGroup from "../components/ui/AuctionsGroup";
import AuctionsList from "../components/ui/AuctionsList";
import {  ButtonUI } from "../components/ui/Button";
import BaseModal from "../components/ui/Modal";

const MOCK_AUCTIONS = [
  { 
    id: "a1", 
    title: "Copart", 
    url: "copart.com", 
    groupId: "1" 
  },
  { 
    id: "a2", 
    title: "IAAI", 
    url: "iaai.com", 
    groupId: "1" 
  },
  { 
    id: "a3", 
    title: "Manheim", 
    url: "manheim.com", 
    groupId: "1" 
  },
  { 
    id: "a4", 
    title: "Ritchie Bros", 
    url: "rbauction.com", 
    groupId: "2" 
  },
  { 
    id: "a5", 
    title: "Mascus", 
    url: "mascus.com", 
    groupId: "2" 
  },
  { 
    id: "a6", 
    title: "Zillow", 
    url: "zillow.com", 
    groupId: "3" 
  },
  { 
    id: "a7", 
    title: "Realtor", 
    url: "realtor.com", 
    groupId: "3" 
  },
  { 
    id: "a8", 
    title: "eBay Motors", 
    url: "ebay.com/motors", 
    groupId: "1" 
  },
  { 
    id: "a9", 
    title: "IronPlanet", 
    url: "ironplanet.com", 
    groupId: "2" 
  },
  { 
    id: "a10", 
    title: "Cars.com", 
    url: "cars.com", 
    groupId: "4" 
  }
];

export default function AuctionsPage() {
  // const { items: auctions, isLoading:IsLoadingAuctions } = useAuctionsData();
  // const { items: groups, 
    // isLoading:IsLoadingGroups 
  // } = useGroups();
  // const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id || "");
  const [activeGroupId, setActiveGroupId] = useState("");

  // const filteredAuctions = auctions.filter(item => item.groupId === activeGroupId);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const IsLoadingAuctions = false;
  return (
    <Box>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" }, 
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" }, // Вирівнювання по центру на ПК
        gap: 2,
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
          Аукціони
        </Typography>

        {/* КНОПКА ВІДКРИТТЯ МОДАЛКИ */}
        <ButtonUI 
          onClick={handleOpen} 
          styles={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Add/>
          Створити групу
        </ButtonUI>

        {/* МОДАЛЬНЕ ВІКНО */}
<BaseModal
  open={isModalOpen}
  onClose={handleClose}
  title="Нова група аукціонів"
  actions={
    <>
      <Button onClick={handleClose} color="inherit">Скасувати</Button>
      <Button 
        onClick={() => { 
          // Логіка відправки на бек: назва + масив обраних ID аукціонів
          handleClose(); 
        }} 
        variant="contained"
      >
        Створити
      </Button>
    </>
  }
>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
    {/* Поле для назви групи */}
    <TextField 
      label="Назва групи" 
      fullWidth 
      autoFocus 
      placeholder="Наприклад: Авто з США"
    />

    {/* Поле вибору аукціонів для додавання в групу */}
    <Autocomplete
      multiple
      id="auctions-select"
      options={MOCK_AUCTIONS} // Ваш масив з 10 об'єктів
      getOptionLabel={(option) => option.title}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label="Додати аукціони до групи"
          placeholder="Виберіть аукціони"
        />
      )}
      sx={{
        '& .MuiChip-root': {
          bgcolor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontWeight: 600
        }
      }}
    />
    
    <Typography variant="caption" color="text.secondary">
      * Ви можете вибрати кілька аукціонів зі списку дозволених.
    </Typography>
  </Box>
</BaseModal>
      </Box>

      {/* Передаємо функцію відкриття модалки також в AuctionsGroup для редагування */}
      <AuctionsGroup 
        activeGroupId={activeGroupId} 
        setActiveGroupId={setActiveGroupId} 
        onEditGroup={(id) => {
          console.log("Редагуємо групу:", id);
          handleOpen(); // Відкриваємо ту саму модалку (або іншу для редагування)
        }}
      />

      {IsLoadingAuctions ? (
        <Typography variant="body1" color="text.secondary">
          Завантаження аукціонів...
        </Typography>
      ) : (
        <AuctionsList filteredAuctions={MOCK_AUCTIONS} />
      )}
    </Box>
  );
}