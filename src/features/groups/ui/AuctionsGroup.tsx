import { DeleteOutline, DirectionsCar, Edit } from "@mui/icons-material";
import { Box, IconButton, Paper, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useMobile } from "../../../shared/hooks/useMobile";
import { Can } from "../../auth/ui/Can";
import type { Group } from "../model/types";
import ConfirmDeleteGroupModal from "./ConfirmDeleteGroupModal";
import DropDownMenu from "./DropDownMenu";



interface Props {
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  onEditGroup?: (groupId: string) => void;
  groups: Group[];
}

export default function AuctionsGroup({ activeGroupId, setActiveGroupId, onEditGroup, groups }: Props) {
  const isMobile = useMobile();
  const [isDeleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);

  const handleOpenDeleteGroupModal = () => setDeleteGroupModalOpen(true);
  const handleCloseDeleteGroupModal = () => setDeleteGroupModalOpen(false);

  const currentGroupExist = groups.find(group => group.id === activeGroupId);
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
        minHeight: "49px", // Гарантує стабільну висоту лінії
      }}
    >
      {groups.length > 0 ? (
        <>
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
          <Can roles={['GroupAdmin', 'SuperAdmin', "Admin"]}>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile ? (
                <DropDownMenu
                  onEdit={() => onEditGroup?.(activeGroupId)}
                  onDelete={handleOpenDeleteGroupModal}
                />
              ) : (
                <>
                  <Box sx={{ pl: 2, pr: 1, borderLeft: "1px solid", borderColor: "divider", my: 1 }}>
                    <Tooltip title="Редагувати поточну групу">
                      <IconButton
                        onClick={() => onEditGroup?.(activeGroupId)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "var(--color-primary)", bgcolor: "rgba(0,0,0,0.04)" },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Tooltip title="Видалити групу">
                    <IconButton
                      size="small"
                      onClick={handleOpenDeleteGroupModal}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "error.main", bgcolor: "error.lighter" },
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          </Can>
        </>
      ) : (
        <Box sx={{ flexGrow: 1, py: 1.5, px: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Для початку створіть вашу першу групу
          </Typography>
        </Box>
      )}

      {currentGroupExist &&
        <ConfirmDeleteGroupModal
          isModalOpen={isDeleteGroupModalOpen}
          handleClose={handleCloseDeleteGroupModal}
          currentGroup={currentGroupExist}
        />
      }

    </Paper>
  );
}