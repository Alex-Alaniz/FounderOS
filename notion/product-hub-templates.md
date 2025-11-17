# Product Hub Templates

These templates should be used to update each Product Hub page in Notion.

## Template Structure

Each Product Hub should contain:

1. Hero Title
2. Product Description
3. Navigation Links
4. 5 Linked Database Views with filter configurations

## BEARO Hub Template

See: `/notion/bearo-hub-content.md`

## AlphaBuilder Hub Template

```markdown
# 🏗 AlphaBuilder Hub

## Product Overview

AlphaBuilder is [product description].

**Status**: [Status]  
**Category**: [Category]  
**Launch Date**: [Date]

---

## 🧭 Navigation

- [Product → Projects](#projects-view)
- [Product → Tasks](#tasks-view)
- [Product → Team](#team-view)
- [Product → CRM](#crm-view)
- [Product → Content Machine](#content-machine-view)

---

## 📊 Product Views

### 🗂 A) Projects View
<mention-database url="{{https://www.notion.so/b6436b6fa21b4b8ea7978c8af805881b}}"/>
**Filter**: Product == AlphaBuilder

### 🗂 B) Tasks View
<mention-database url="{{https://www.notion.so/15d0e156c8814c128d9bb2c8371d5acc}}"/>
**Filter**: Project → Product == AlphaBuilder

### 🗂 C) Team View
<mention-database url="{{https://www.notion.so/b0110392b769474bb2968c9a9d2da066}}"/>
**Filter**: Tasks → Project → Product == AlphaBuilder

### 🗂 D) CRM View
<mention-database url="{{https://www.notion.so/2e2c972956e243968ba34c6db28717aa}}"/>
**Filter**: Product == AlphaBuilder

### 🗂 E) Content Machine View
<mention-database url="{{https://www.notion.so/dc4b71505fa54c4da12f2ee642c1da08}}"/>
**Filter**: Product == AlphaBuilder
```

## Primape Hub Template

Same structure, replace "AlphaBuilder" with "Primape"

## Chimpanion Hub Template

Same structure, replace "AlphaBuilder" with "Chimpanion"

## BEARCO Ecosystem Hub Template

Same structure, replace "AlphaBuilder" with "BEARCO Ecosystem"

