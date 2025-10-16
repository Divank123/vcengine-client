"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TimeRow } from "../shared/time-row"
import { UploadBox } from "../shared/upload-box"
import { toMinutes } from "../lib/utils"

interface MainDialogProps {
    showActionDialog: boolean,
    setShowActionDialog: (v: boolean) => void,
    setOpenAdd: (v: boolean) => void,
    setOpenReplace: (v: boolean) => void,
    setOpenRemove: (v: boolean) => void
}

export function MainDialog(props: MainDialogProps) {
    const {
        showActionDialog,
        setShowActionDialog,
        setOpenAdd,
        setOpenReplace,
        setOpenRemove
    } = props

    return (
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Choose edit action</DialogTitle>
                    <DialogDescription>Select the type of change you want to apply.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setOpenAdd(true),
                                setShowActionDialog(false)
                        }}
                    >
                        Add
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setOpenReplace(true)
                            setShowActionDialog(false)
                        }}
                    >
                        Replace
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setOpenRemove(true)
                            setShowActionDialog(false)
                        }}
                    >
                        Remove
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
