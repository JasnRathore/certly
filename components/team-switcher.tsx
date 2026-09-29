"use client"

import * as React from "react"
import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { createOrg, setActiveOrg } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ChevronsUpDownIcon, Loader2, PlusIcon } from "lucide-react"

export interface OrganizationMembership {
  orgId: string
  role: string
  organization: {
    id: string
    name: string
    avatar: string
  }
}

export function TeamSwitcher({
  organizations,
  currentOrganization,
}: {
  organizations: OrganizationMembership[]
  currentOrganization: OrganizationMembership["organization"]
}) {
  const { isMobile } = useSidebar()
  const [activeOrganizationId, setActiveOrganizationId] = React.useState(
    currentOrganization.id,
  )
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newOrganizationName, setNewOrganizationName] = React.useState("")
  const [createError, setCreateError] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const activeOrganization =
    organizations.find(
      (membership) => membership.organization.id === activeOrganizationId,
    )?.organization ?? currentOrganization

  if (!activeOrganization.name) {
    return null
  }

  const handleOrganizationChange = async (
    membership: OrganizationMembership,
  ) => {
    if (membership.organization.id === activeOrganizationId) {
      return
    }

    setActiveOrganizationId(membership.organization.id)
    await setActiveOrg(membership.orgId)
    window.location.reload()
  }

  const handleCreateOrganization = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    const name = newOrganizationName.trim()
    if (!name || isCreating) return

    setIsCreating(true)
    setCreateError("")
    try {
      const result = await createOrg(name)
      if (result.error) {
        setCreateError(result.error)
        return
      }
      setIsCreateOpen(false)
      setNewOrganizationName("")
      window.location.reload()
    } catch {
      setCreateError("Couldn't create the organization. Try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Image
              src={activeOrganization.avatar}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              unoptimized
              className="size-8 rounded-lg object-cover"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeOrganization.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                Organization
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((membership, index) => (
                <DropdownMenuItem
                  key={membership.organization.id}
                  onClick={() => handleOrganizationChange(membership)}
                  className="gap-2 p-2"
                >
                  <Image
                    src={membership.organization.avatar}
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={24}
                    unoptimized
                    className="size-6 rounded-md object-cover"
                  />
                  <span className="truncate">{membership.organization.name}</span>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCreateError("")
                setIsCreateOpen(true)
              }}
              className="gap-2 p-2"
            >
              <PlusIcon />
              <span>Create organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            if (!isCreating) setIsCreateOpen(open)
          }}
        >
          <DialogContent>
            <form onSubmit={handleCreateOrganization} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Create organization</DialogTitle>
                <DialogDescription>
                  Create a new organization to manage its events and members.
                </DialogDescription>
              </DialogHeader>
              <Field>
                <FieldLabel htmlFor="new-organization-name">
                  Organization name
                </FieldLabel>
                <Input
                  id="new-organization-name"
                  autoFocus
                  maxLength={80}
                  value={newOrganizationName}
                  onChange={(event) => setNewOrganizationName(event.target.value)}
                  placeholder="e.g. Acme Corp"
                  aria-invalid={Boolean(createError)}
                  aria-describedby={createError ? "create-organization-error" : undefined}
                />
              </Field>
              {createError && (
                <p
                  id="create-organization-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {createError}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreating}
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !newOrganizationName.trim()}
                >
                  {isCreating && <Loader2 className="animate-spin" data-icon="inline-start" />}
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
