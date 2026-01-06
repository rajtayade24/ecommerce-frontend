import React from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

function DialogContentImpl({
  title = "Edit profile",
  desc = "Make changes to your profile here.",
  content = null,
  save = "Save changes",
  onSave,
  cancel = "cancel"
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {desc}
        </DialogDescription>
      </DialogHeader>
      {content}
      <DialogFooter>


        <DialogClose asChild>
          <Button variant="outline">{cancel}</Button>
        </DialogClose>


        <DialogClose asChild>
          <Button
            type="button"
            onClick={() => {
              onSave && onSave()
            }}
          >
            {save}
          </Button>
        </DialogClose>
        
      </DialogFooter>
    </DialogContent >
  )
}

export default DialogContentImpl
