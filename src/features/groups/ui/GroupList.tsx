import { Box } from "@mui/material";
import type { Group } from "../model/types";
import GroupTabItem from "./GroupItem";

interface Props {
    groups: Group[],
    activeGroupId: string,
    setActiveGroupId: (id: string) => void,
    onEdit: (() => void) | undefined,
    onDelete: () => void

}

export default function AuctionsGroup({ groups, activeGroupId, setActiveGroupId, onEdit, onDelete }: Props) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: { xs: 1.5, sm: 2 },
                overflowX: 'auto',
                pb: 2,
                mb: 3,
                px: { xs: 2, sm: 0 },
                mx: { xs: -2, sm: 0 },
                // scrollSnapType: "x mandatory",
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
            }}
        >
            {groups.map((group: Group) => (
                <GroupTabItem
                    key={group.id}
                    group={group}
                    isActive={activeGroupId === group.id}
                    onSelect={setActiveGroupId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    );
}