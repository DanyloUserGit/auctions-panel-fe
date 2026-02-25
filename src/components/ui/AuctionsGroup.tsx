import { Paper, Tab, Tabs } from "@mui/material";
import { DirectionsCar } from "@mui/icons-material";
const MOCK_GROUPS = [
  { id: "1", name: "Автомобільні", icon: <DirectionsCar fontSize="small" /> },
  { id: "2", name: "Спецтехніка", icon: <DirectionsCar fontSize="small" /> },
  { id: "3", name: "Нерухомість", icon: <DirectionsCar fontSize="small" /> },
  { id: "4", name: "Інші", icon: <DirectionsCar fontSize="small" /> },
];

export default function AuctionsGroup({ activeGroupId, setActiveGroupId }: { activeGroupId: string, setActiveGroupId: (id: string) => void }) {

    return (
    <Paper elevation={0} sx={{ borderBottom: 1, borderColor: "divider", mb: 4, bgcolor: "transparent" }}>
        <Tabs 
          value={activeGroupId} 
          onChange={(_, v) => setActiveGroupId(v)}
          variant="scrollable"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
              gap: 1, // Відступ між іконкою та текстом
            },
            "& .Mui-selected": { color: "var(--color-primary) !important" },
            "& .MuiTabs-indicator": { backgroundColor: "var(--color-primary)" }
          }}
        >
          {MOCK_GROUPS.map((group) => (
            <Tab 
              key={group.id} 
              icon={group.icon} 
              iconPosition="start" 
              label={group.name} 
              value={group.id} 
            />
          ))}
        </Tabs>
      </Paper>
  )
}
