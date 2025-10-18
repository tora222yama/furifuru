# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tone

- CLI上のメッセージは全て日本語表記にしてください  
- CLI上のメッセージは20～30文字で改行してください 

## Project Overview

This is a Laravel 11 \+ Inertia.js \+ React/TypeScript workplace portal application with SSR support. The application uses a hybrid approach with both REST (via Inertia) and GraphQL APIs.

## Essential Commands

**IMPORTANT: When running in Docker environment, all commands (except docker-compose) must be executed through Docker using the format:**

```shell
docker exec -i wportal2_web bash -c "COMMAND_HERE"
```

**Note: The actual npm scripts are:**

- `npm run tsc` (not `npm run type-check`)  
- `npm run eslint` (not `npm run lint`)

### Development

```shell
# Start development server with HMR
docker exec -i wportal2_web bash -c "npm run dev"

# Start PHP development server
docker exec -i wportal2_web bash -c "php artisan serve"

# Start SSR server (for production-like testing)
docker exec -i wportal2_web bash -c "php artisan inertia:start-ssr"

# Run in Docker environment (preferred)
docker-compose up -d
# After setup, the application can be accessed at http://localhost:9190
```

### Code Quality & Testing

**IMPORTANT: Linting and code quality checks are managed by lefthook. Do not run individual lint commands:**

```shell
# Run all pre-commit hooks (includes linting, type checking, etc.)
docker exec -i wportal2_web bash -c "npm run lefthook"

# Run tests
docker exec -i wportal2_web bash -c "php artisan test"
docker exec -i wportal2_web bash -c "npm run test"

# Run specific test
docker exec -i wportal2_web bash -c "php artisan test --filter TestName"
```

**Individual commands (avoid using these \- use lefthook instead):**

```shell
# TypeScript type checking (use lefthook instead)
docker exec -i wportal2_web bash -c "npm run tsc"

# ESLint (use lefthook instead)
docker exec -i wportal2_web bash -c "npm run eslint"

# PHP code style fixer (use lefthook instead)
docker exec -i wportal2_web bash -c "./vendor/bin/pint"

# PHPStan static analysis (use lefthook instead)
docker exec -i wportal2_web bash -c "./vendor/bin/phpstan analyse"
```

### Database & GraphQL

```shell
# Run migrations
docker exec -i wportal2_web bash -c "php artisan migrate"

# Seed test data
docker exec -i wportal2_web bash -c "php artisan db:seed --class=TestCaseSeeder"

# Generate GraphQL TypeScript types and hooks
docker exec -i wportal2_web bash -c "npm run gen"

# Generate IDE helpers
docker exec -i wportal2_web bash -c "php artisan ide-helper:generate"
docker exec -i wportal2_web bash -c "php artisan ide-helper:models"
```

### Build & Deploy

```shell
# Build for production
docker exec -i wportal2_web bash -c "npm run build"

# Build SSR bundle
docker exec -i wportal2_web bash -c "npm run build:ssr"
```

### After Enum Updates

```shell
# Generate TypeScript types from PHP enums
docker exec -i wportal2_web bash -c "php artisan tool:MakeTypescriptEnum"
```

## Architecture Overview

### Core Patterns

1. **Pipe Pattern** (`/app/Pipe/`)  
     
   - Custom request handling pattern for business logic  
   - Each Pipe encapsulates validation and processing  
   - Example: `PipeAppOnboardingCreate` handles onboarding creation  
   - All pipes extend `PipeBase`

   

2. **Service Layer** (`/app/Services/`)  
     
   - Model services act as repositories (`/app/Services/Models/`)  
   - External service integrations (`/app/Services/External/`)  
   - Services are registered as Laravel Facades  
   - Base class `ModelServiceBase` provides CRUD operations

   

3. **Enum-Driven Development**  
     
   - PHP enums in `/app/Enum/` are auto-generated to TypeScript  
   - `EPages` enum maps routes to controller actions  
   - Validation rules defined as enums

   

4. **GraphQL Integration**  
     
   - Schema files in `/graphql/`  
   - Resolvers in `/app/GraphQL/`  
   - Apollo Client for frontend state management  
   - Custom hooks for queries (e.g., `useFetchAppTrnUserList`)

### Frontend Structure

```
/resources/script/
├── Common/          # Utilities and helpers
├── Component/       # Reusable UI components
├── Enum/           # Generated TypeScript enums
├── Hooks/          # Custom React hooks
├── Models/         # TypeScript interfaces (prefix with 'I')
├── Pages/          # Inertia page components
└── Provider/       # React context providers
```

### Database Conventions

- Tables prefixed by type: `trn_` (transaction), `mst_` (master), `auth_` (authentication)  
- Uses `e_archive_level` enum instead of soft deletes  
- Model services handle all database operations

### Key Integration Points

1. **Inertia.js Flow**  
     
   - Routes in `web.php` map to controller actions  
   - Controllers return `Inertia::render('PageComponent', $data)`  
   - Page components receive props from server

   

2. **GraphQL Flow**  
     
   - Define schema in `/graphql/*.graphql`  
   - Run `npm run gen` to generate TypeScript types  
   - Use generated hooks in React components

   

3. **Validation Flow**  
     
   - Server-side: Validation in Pipe classes using Laravel rules  
   - Client-side: Form validation in React components  
   - Shared validation enums ensure consistency

### Common Development Tasks

1. **Adding a New Page**  
     
   - Add route in `web.php`  
   - Create controller method returning Inertia response  
   - Create React component in `/resources/script/Pages/`  
   - Add page enum entry in `EPages.php`  
   - Add corresponding route in `getInvokePath()` method  
   - Run `php artisan tool:MakeTypescriptEnum` to generate TypeScript types  
   - Add URL mapping in `EPages.ts` `getHref()` function

   

2. **Adding GraphQL Query/Mutation**  
     
   - Define schema in `/graphql/App/[FeatureName].graphql` using `extend type Mutation @guard`  
   - Define mutation documents in `/graphql/App/Mutations/[FeatureName].graphql` with variables and response fields  
   - Create resolver classes in `/app/GraphQL/App/Mutations/`  
   - Add schema import to `/graphql/schema.graphql`  
   - Run `npm run gen` to generate TypeScript types  
   - Create custom hooks in `/resources/script/Hooks/App/Mutations/` following existing patterns  
   - Use custom hooks in React components (avoid direct Apollo Client usage)

   

3. **Adding Business Logic**  
     
   - Create Pipe class in `/app/Pipe/`  
   - Add corresponding enum entry in `EPipeKind`  
   - Implement validation and processing  
   - Call from controller or GraphQL resolver  
   - Use model services for database operations  
   - Run `php artisan tool:MakeTypescriptEnum` after enum updates

   

4. **Adding Delete Functionality**  
     
   - Create delete Pipe class (e.g., `PipeAppResourceDelete`)  
   - Add delete enum entries in `EPages` and `EPipeKind`  
   - Add delete route in `web.php`  
   - Create delete method in controller with transaction  
   - Implement `execAppResourceDelete` in service class  
   - Use `EArchiveLevel::ARCHIVE` for soft deletes  
   - Add delete button with confirmation dialog in UI  
   - Use `DialogYesNo` component for delete confirmation

   

5. **Adding Edit/Update Functionality**  
     
   - Add `ENTITY__EDIT` and `ENTITY__UPDATE` enum entries in `EPages.php`  
   - Add `APP_ENTITY_UPDATE` enum entry in `EPipeKind.php`  
   - Create `PipeAppEntityUpdate` class in `/app/Pipe/App/`  
   - Add `edit()` and `update()` methods to controller:

```php
public function edit(Request $request): Response
{
    $entityId = (int) $request->route('entityId');
    $entity = EntityService::findByIdOrFail($entityId);
    
    return $this->render('Entity/Edit/Index', [
        'entity' => fn () => $entity->toPayload(),
        'serverValidation' => fn () => session('serverValidation') ?? null,
        // ... other data
    ]);
}
```

   - Update service `updateByPipe()` method with new case in match statement  
   - Add `execUpdate()` method to service (order must match enum order)  
   - Add routes: `GET /{entityId}/edit` and `POST /{entityId}/update`  
   - Create Edit page components: `Edit/Index.tsx`, `Edit/Edit.tsx`, `Edit/FormEdit.tsx`, `Edit/FormEditValidation.ts`  
   - Follow Division/Edit pattern for component structure  
   - Run `php artisan tool:MakeTypescriptEnum` to generate TypeScript enums

### Important Notes

- Always run `npm run gen` after modifying GraphQL schemas  
- Always run `php artisan tool:MakeTypescriptEnum` after modifying PHP enums  
- TypeScript interfaces must start with 'I' (ESLint rule)  
- Use Material-UI components from the existing setup  
- Follow existing patterns for consistency  
- Pre-commit hooks will run type checking and linting automatically  
- When implementing delete functionality, always use soft deletes with `e_archive_level`  
- Remember to update both PHP enum and TypeScript `getHref()` function when adding new pages

## Validation Implementation Guidelines

### Client-Side Validation Pattern

1. **Validation File Structure**  
     
   - Create validation files following the pattern: `Form[Name]Validation.ts`  
   - Use the exact structure from existing validation files (e.g., `FormCreateValidation.ts`)  
   - Define validation result interfaces as `IForm[Name]ValidationResult`  
   - Include `initialResult` constant with `hasError: false` and empty `data`

   

2. **Validation Result Type**

```ts
interface IFormValidationResult {
  hasError: boolean;
  data: {
    [fieldName]: ValidationResult;
  };
}
```

3. **Form Component Props**  
     
   - Validation prop should be required (not optional): `validation: IFormValidationResult`  
   - Access errors using: `validation.data.fieldName?.errors`  
   - Pass errors to form fields: `errors={validation.data.fieldName?.errors}`

### Form Submission Pattern

1. **Use router.visit for Inertia Forms**

```ts
router.visit(
  getPagesHref(E_PAGES.PAGE_NAME, routeParams),
  {
    method: 'post',
    preserveState: true,
    preserveScroll: true,
    data: formData,
    onStart,
    onFinish,
  }
);
```

2. **Required Hooks**  
     
   - Always use `useProgressContext` for `onStart` and `onFinish`  
   - Use `validateAll` before submission  
   - Check `validation.hasError` before proceeding

### Server-Side Implementation Pattern

1. **Controller Method Structure**

```php
public function actionName(Request $request): RedirectResponse
{
    PipeService::insertNewPipe(
        new PipeAppActionName($request->toArray())
    );

    if (! PipeService::isValid()) {
        return redirect()->action(EPages::PAGE_NAME->getInvokePath(), $routeParams)
            ->with(['serverValidation' => PipeService::getValidationResult()]);
    }

    DB::transaction(static function (): void {
        // TODO: 実装
    });

    return redirect()->action(EPages::SUCCESS_PAGE->getInvokePath(), $routeParams);
}
```

2. **Pipe Class Requirements**  
     
   - Create in `/app/Pipe/App/` directory  
   - Add corresponding enum entry in `EPipeKind`  
   - Implement `parse()` and `validate()` methods  
   - Use `ValidationPacker` for validation rules

### Enum Updates

1. **When Adding New Pages/Actions**  
     
   - Add enum case in `EPages.php`  
   - Add corresponding controller mapping in `getInvokePath()` method  
   - Format: `self::ENUM_NAME => '\App\Http\Controllers\Pages\ControllerName@methodName'`

   

2. **Route Definition**  
     
   - Add route in `web.php` using the enum: `EPages::ENUM_NAME->getInvokePath()`  
   - Use appropriate HTTP method (GET for pages, POST for actions)

### Validation Error Handling in Index Components

1. **Add Server Validation Support**

```ts
interface IProps {
  serverValidation?: IMutationResult;
}

React.useEffect(() => {
  if (!serverValidation?.errors) {
    return;
  }
  setValidation(
    parseServerValidation({
      statusCode: Number(serverValidation.statusCode),
      statusMessage: String(serverValidation.statusMessage),
      errors: parseErrors(String(serverValidation.errors)),
    }),
  );
}, [serverValidation]);
```

2. **Context Setup**  
     
   - Include validation state in context  
   - Provide both `validation` and `setValidation` in context

### Service Layer Implementation

1. **Service Class updateByPipe Method**

```php
public function updateByPipe(): void
{
    foreach (PipeService::getPipes(__CLASS__) as $pipe) {
        $kind = $pipe->getKind();
        match ($kind) {
            EPipeKind::SPECIFIC_KIND => $this->execSpecificAction($pipe),
            default => throw new Exception('Invalid pipe kind: '.$kind->value),
        };
    }
}
```

2. **Execution Method Naming Convention**  
     
   - Method names should match the EPipeKind enum pattern  
   - Format: `exec[EPipeKindName]` (e.g., `execAppOnboardingActionUpdate`)  
   - Use descriptive names that match the business logic

   

3. **Database Operations**  
     
   - **NEVER use `save()` directly on models**  
   - Always use base class methods for consistency and error handling:  
     - `$this->insertOrFail($model)` for new records  
     - `$this->updateOrFail($model)` for updates  
     - `$this->deleteOrFail($model)` for hard deletions  
   - For soft deletes, set `e_archive_level = EArchiveLevel::ARCHIVE` and use `updateOrFail()`  
   - Always use `alive()` scope when counting records in pagination

   

4. **Pipe Processing Best Practices**  
     
   - Remove `assert()` statements \- type safety is handled by the framework  
   - Access pipe properties directly: `$pipe->propertyName`  
   - Wrap database operations in transactions at the controller level

   

5. **Required Imports for Service Classes**

```php
use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\Pipe\App\PipeAppSpecificAction;
use App\Pipe\PipeBase;
use Exception;
```

6. **Pipe Class Validation Implementation**  
     
   - Use `ValidationPacker` with correct namespace: `App\Enum\ValidationRules\ValidationPacker`  
   - Import `EValidationType` for validation rules  
   - Follow the pattern from existing pipes like `PipeAppDivisionCreate`:

```php
public function validate(): void
{
    $packer = new ValidationPacker;
    
    $packer->addValidation(
        'fieldName',
        'フィールド名',
        $this->fieldName,
        collect([
            EValidationType::REQUIRED->ruleSet(),
            EValidationType::LENGTH->ruleSet(255),
        ])
    );
    
    $validator = $packer->makeValidator();
    if ($validator->fails()) {
        $this->errors = $validator->errors();
    }
}
```

7. **Route Parameter Access in Controllers**  
     
   - Use `$request->route('parameterName')` to get route parameters  
   - Cast to appropriate type: `(int) $request->route('entityId')`  
   - Pass as array to Pipe constructor with request data: `$request->toArray()`  
   - Let Pipe access route parameters directly in `parse()` method if needed

   

8. **Service Layer Match Statement Order**  
     
   - Ensure enum cases in `match` statement follow the same order as `EPipeKind` enum  
   - Place corresponding `exec*` methods in the same order in the service class  
   - Example:

```php
match ($kind) {
    EPipeKind::APP_ENTITY_CREATE => $this->execCreate($pipe),
    EPipeKind::APP_ENTITY_UPDATE => $this->execUpdate($pipe),
    EPipeKind::APP_ENTITY_DELETE => $this->execDelete($pipe),
    default => throw new Exception('Invalid pipe kind: '.$kind->value),
};
```

## Data Flow and Context Management

### Server Data Reception Pattern

1. **Controller Data Passing**  
     
   - Pass server data to Inertia components using lazy evaluation:

```php
return $this->render('ComponentPath', [
    'serverData' => fn () => $this->getServerData($request),
]);
```

2. **Index Component Context Pattern**  
     
   - Create context providers in Index components to share data with child components  
   - Follow the pattern from existing Index components:

```ts
type IndexContext = {
  dataList: AppDataList;
  dataListCount: number;
};

export const context = React.createContext<IndexContext>({
  dataList: new AppDataList(),
  dataListCount: 0,
});

export const useIndexContext = (): IndexContext => useContext(context);
```

3. **Child Component Data Access**  
     
   - Replace `usePage()` with `useIndexContext()` for accessing parent data  
   - Use the context pattern to avoid direct page prop dependencies  
   - Example:

```ts
// Instead of: const page = usePage(); const id = page.props.resourceId;
// Use: const { dataList } = useIndexContext(); const data = dataList.first();
```

4. **Model Service Requirements**  
     
   - Ensure all model services have `findByIdOrFail()` method for single record retrieval  
   - Follow the pattern from existing services:

```php
public function findByIdOrFail(int $id, array $with = []): ModelClass
{
    return ModelClass::query()
        ->with($with)
        ->alive()
        ->findOrFail($id);
}
```

### Context Provider Hierarchy

1. **Parent Index Components**  
     
   - Receive data from controller props  
   - Parse and store data in context  
   - Provide context to child components via provider pattern

   

2. **Child Index Components (New/Edit/etc.)**  
     
   - Can have their own local context for form validation  
   - Access parent data via parent context hooks  
   - Use `CommonIndexProvider` for consistent structure

   

3. **UI Components**  
     
   - Access data through appropriate context hooks  
   - Avoid direct dependency on Inertia page props when possible

### Edit Page Implementation Pattern

1. **Edit Component Structure**  
     
   - Follow the pattern: `Edit/Index.tsx` → `Edit/Edit.tsx` → `Edit/FormEdit.tsx`  
   - `Index.tsx`: Context provider with server data and validation state  
   - `Edit.tsx`: Main edit page with form handling and submission  
   - `FormEdit.tsx`: Form fields and validation display  
   - `FormEditValidation.ts`: Validation logic and error parsing

   

2. **Context Pattern for Edit Pages**

```ts
type IndexContext = {
  entityList: AppEntityList;          // Single entity wrapped in list
  validation: IFormEditValidationResult;
  setValidation: (validation: IFormEditValidationResult) => void;
  // ... other related data (projects, divisions, etc.)
};
```

3. **Form State Management**  
     
   - Initialize form state from context data: `entity.first()`  
   - Use `handleUpdate` callback pattern for form field updates  
   - Validate before submission using `validateAll()`  
   - Handle server validation errors in useEffect

   

4. **Navigation and URL Patterns**  
     
   - Edit button: `router.visit(getPagesHref(E_PAGES.ENTITY__EDIT, [{ target: '$entityId', value: String(id) }]))`  
   - Update submission: Include route parameters in URL and pass form data  
   - Use `preserveState: true` and `preserveScroll: true` for better UX

   

5. **Component Reference Patterns**  
     
   - Use Division/Edit components as reference for complex edit pages  
   - Use existing New components as base for form structure  
   - Maintain consistent validation and error handling patterns

## GraphQL Mutation Implementation Guidelines

### GraphQL Schema Structure

1. **Schema Definition Pattern**

```
# /graphql/App/[FeatureName].graphql
extend type Mutation @guard {
  FeatureMutationName(
    parameterName: ID!
  ): Response! @field(
    resolver: "App\\GraphQL\\App\\Mutations\\FeatureMutationName"
  )
}
```

2. **Mutation Document Pattern**

```
# /graphql/App/Mutations/[FeatureName].graphql
mutation FeatureMutationName (
  $parameterName: ID!
) {
  FeatureMutationName (
    parameterName: $parameterName
  ) {
    statusCode
    statusMessage
    errors
  }
}
```

### Backend Implementation

1. **GraphQL Resolver Pattern**

```php
// /app/GraphQL/App/Mutations/FeatureMutationName.php
final class FeatureMutationName
{
    public function __invoke(mixed $_, array $args): array
    {
        PipeService::insertNewPipe(
            new PipeAppFeatureMutationName($args)
        );

        if (! PipeService::isValid()) {
            return PipeService::getValidationResult();
        }

        DB::transaction(static function (): void {
            FeatureService::updateByPipe();
        });

        return PipeService::getResult();
    }
}
```

2. **Service Layer Sort Implementation**  
     
   - Create `execAppFeatureSortUp/Down` methods in service class  
   - Use `findByIdOrFail()` to get target record  
   - Query adjacent records using `where('sort_order', '<', $target->sort_order)` for up  
   - Query adjacent records using `where('sort_order', '>', $target->sort_order)` for down  
   - Swap sort\_order values between target and adjacent record  
   - Use `updateOrFail()` for both records in transaction

### Frontend Implementation

1. **Custom Hook Pattern**

```ts
// /resources/script/Hooks/App/Mutations/useMutationFeatureName.tsx
export function useMutationFeatureName(): [
  boolean,
  (
    parameterId: string,
    refetchQueries: DocumentNode[],
  ) => Promise<IMutationResult>,
] {
  const [sending, setSending] = React.useState<boolean>(false);
  const [mutation] = useFeatureNameMutation({});
  const client = useApolloClient();

  const mutationFeatureName = async (
    parameterId: string,
    refetchQueries: DocumentNode[],
  ): Promise<IMutationResult> => {
    setSending(true);
    
    return new Promise<IMutationResult>(resolve => {
      mutation({
        variables: { parameterId },
      }).then(async response => {
        const statusCode = Number(response.data?.FeatureName?.statusCode);
        
        if (statusCode === E_STATUS_CODE.OK && refetchQueries.length) {
          await client.refetchQueries({ include: refetchQueries });
        }
        
        setSending(false);
        resolve({
          statusCode,
          statusMessage: String(response.data?.FeatureName?.statusMessage),
          errors: parseErrors(response.data?.FeatureName?.errors),
        });
      });
    });
  };

  return [sending, mutationFeatureName];
}
```

2. **Component Usage Pattern**

```ts
const [processing, mutationFunction] = useMutationFeatureName();
const loading = processing;

// Handler function (avoid useCallback for better loading state management)
const handleAction = (item: IItem) => {
  onStart();
  mutationFunction(String(item.id), []).then(res => {
    onFinish();
    if (res.statusCode === E_STATUS_CODE.OK) {
      router.reload({
        method: 'post',
        replace: true,
        data: { /* pagination data */ },
        only: ['dataProperty'],
      });
    }
  });
};
```

### Best Practices

1. **Schema Organization**  
     
   - Use separate files for schema definitions and mutation documents  
   - Group related mutations in the same feature files  
   - Import schema files in `/graphql/schema.graphql`

   

2. **Error Handling**  
     
   - Always return `Response` type with `statusCode`, `statusMessage`, and `errors`  
   - Use `PipeService::getValidationResult()` for validation errors  
   - Use `PipeService::getResult()` for successful operations

   

3. **Loading States**  
     
   - Avoid `useCallback` in mutation handlers to ensure loading state updates properly  
   - Use custom hooks that return `[boolean, function]` pattern  
   - Combine multiple mutation loading states when needed: `const loading = processing1 || processing2`

   

4. **Sort Order Implementation**  
     
   - Always check for adjacent records before swapping  
   - Use `orderBy('sort_order', 'desc')` for "up" movement (get previous item)  
   - Use `orderBy('sort_order', 'asc')` for "down" movement (get next item)  
   - Perform swaps within database transactions

   

5. **Required Commands After Changes**  
     
   - Run `npm run gen` after GraphQL schema/mutation changes  
   - Run `php artisan tool:MakeTypescriptEnum` after PHP enum updates  
   - Test with `npm run lefthook` for code quality checks

## Interaction Guidelines

- When the user asks to '計画してください' (make a plan), I must propose the plan and wait for their approval before proceeding with implementation.

### Adding a New "Show" Page (Detail View)

When creating a new detail page (e.g., `.../Show/Index.tsx`), follow this pattern, using `Division/Show` as a reference:

1. **Controller Method**:  
     
   * Create a `show()` method in the corresponding Laravel controller.  
   * This method should retrieve a single record using its ID from the route.  
   * Use a dedicated private getter function (e.g., `getOnboardingStatus()`) to fetch the data via the appropriate `Service::findByIdOrFail()`.  
   * Pass the data to the Inertia component using a lazy-loaded prop (e.g., `'onboardingStatus' => fn () => $data->toPayload()`).

   

2. **Frontend `Index.tsx` (`/Pages/.../Show/Index.tsx`)**:  
     
   * Create a new `Index.tsx` file in the appropriate `Show` directory.  
   * Define a `Context` to hold the data for the page (e.g., `onboardingStatusList`).  
   * Receive the prop from the controller, parse it into a `List` model (even if it's a single item), and provide it through the context.  
   * Render the main view component (e.g., `<OnboardingStatusShow />`) inside the context provider.

   

3. **Frontend View Component (`/Pages/.../Show/Component.tsx`)**:  
     
   * Create the actual view component (e.g., `OnboardingStatusShow.tsx`).  
   * Use the `useIndexContext()` hook to access the data.  
   * Wrap the content in the `<Page>` component.  
   * Include a `<BackLink>` component for navigation.  
   * Display the data using components like `<TypoH1>`, `<Paper>`, and `<LabelValue>`.

   

4. **Linking from a List Page**:  
     
   * On the list page's table component (e.g., `OnboardingStatusTable.tsx`), add an `onClick` handler to the `TableRow`.  
   * Use `router.visit()` with `getPagesHref()` to navigate to the corresponding "Show" page, passing the record's ID as a route parameter.  
   * Add hover styles (`cursor: 'pointer'`, `backgroundColor`) to the `TableRow` to indicate it's clickable.

