import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "../../lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=calendar-content]_&]:sm:[--cell-size:--spacing(10)]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex flex-col gap-4 md:flex-row md:gap-8",
          defaultClassNames.months
        ),
        month: cn("flex flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:pointer-events-none aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:pointer-events-none aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) text-sm font-medium",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "relative flex items-center gap-2 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md border border-input bg-background shadow-xs has-focus:border-ring has-focus:ring-ring/50 has-focus:ring-[3px]",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 opacity-0 appearance-none",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-md pr-2 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-md select-none text-[0.8rem] font-normal text-muted-foreground",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full aspect-square h-full p-0 text-center text-sm group/day select-none [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative bg-accent select-none day-range-start rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "relative rounded-none select-none",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "relative bg-accent select-none day-range-end rounded-r-md",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-md",
          defaultClassNames.today
        ),
        outside: cn(
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props} />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRight
                className={cn("size-4", className)}
                {...props} />
            )
          }

          return (
            <ChevronDown className={cn("size-4", className)} {...props} />
          )
        },
        ...components,
      }}
      {...props} />
  )
}

export { Calendar }
