import { Paper, Tab, Tabs, Box, IconButton, Tooltip } from "@mui/material";
import { DeleteOutline, DirectionsCar, Edit } from "@mui/icons-material";
import { useMobile } from "../../../shared/hooks/useMobile";
import DropDownMenu from "../../groups/ui/DropDownMenu";

interface Group {
  id: string;
  title: string;
}

interface Props {
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  onEditGroup?: (groupId: string) => void;
  groups: Group[]
}

export default function AuctionsGroup({ activeGroupId, setActiveGroupId, onEditGroup, groups }: Props) {
  const isMobile = useMobile()
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "divider",
        mb: 4,
        bgcolor: "transparent",
        position: "relative",
      }}
    >
      {/* Контейнер для вкладок (займає всю доступну ширину, крім кнопки) */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Tabs
          value={activeGroupId}
          onChange={(_, v) => setActiveGroupId(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
              gap: 1,
            },
            "& .Mui-selected": { color: "var(--color-primary) !important" },
            "& .MuiTabs-indicator": { backgroundColor: "var(--color-primary)" },
          }}
        >
          {groups.map((group) => (
            <Tab
              key={group.id}
              icon={<DirectionsCar fontSize="small" />}
              iconPosition="start"
              label={group.title}
              value={group.id}
            />
          ))}
        </Tabs>
      </Box>

      {isMobile ?
        <DropDownMenu
          onEdit={() => console.log('Edit')}
          onDelete={() => console.log('Delete')}
        />
        : (<>
          <Box sx={{ pl: 2, pr: 1, borderLeft: "1px solid", borderColor: "divider", my: 1 }}>
            <Tooltip title="Редагувати поточну групу">
              <IconButton
                onClick={() => onEditGroup?.(activeGroupId)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "var(--color-primary)", bgcolor: "rgba(0,0,0,0.04)" }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title="Видалити групу">
            <IconButton
              size="small"
              onClick={() => {
                if (window.confirm("Ви впевнені, що хочете видалити цю групу?")) {
                  // onDeleteGroup?.(activeGroupId);
                }
              }}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "error.main", bgcolor: "error.lighter" }
              }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </>)
      }


    </Paper>
  );
}